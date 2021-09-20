import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../../lib/bignumber";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";
import { TokenInput } from "../../../components/token-input";
import { Trans, useTranslation } from "react-i18next";
import { useTransaction } from "../../../hooks/use-transaction";
import { TransactionCallout } from "../../../components/transaction-callout";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";
import { Routes } from "../../router-config";
import { Link } from "react-router-dom";
import { DexTokensSection } from "../dex-table";
import { LiquidityAction, LiquidityState } from "../liquidity-reducer";
import { EthConnectPrompt } from "../../../components/eth-connect-prompt";
import { useGetLiquidityBalances } from "../hooks";
import { Callout } from "../../../components/callout";
import { Error } from "../../../components/icons";

export const LiquidityDepositPage = ({
  lpTokenAddress,
  name,
  state,
  dispatch,
}: {
  lpTokenAddress: string;
  name: string;
  state: LiquidityState;
  dispatch: React.Dispatch<LiquidityAction>;
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
  const [allowance, setAllowance] = React.useState<BigNumber>(new BigNumber(0));
  const {
    state: txApprovalState,
    dispatch: txApprovalDispatch,
    perform: txApprovalPerform,
  } = useTransaction(() => lpStaking.approve(ethAddress, lpTokenAddress));
  const {
    state: txStakeState,
    dispatch: txStakeDispatch,
    perform: txStakePerform,
  } = useTransaction(() => lpStaking.stake(amount, ethAddress));
  const { ethAddress } = useEthUser();
  const { getBalances, lpStakingEth, lpStakingUSDC } = useGetLiquidityBalances(
    dispatch,
    ethAddress
  );
  React.useEffect(() => {
    const run = async () => {
      try {
        await Promise.all([
          getBalances(lpStakingUSDC, REWARDS_ADDRESSES["Sushi Swap VEGA/USDC"]),
          getBalances(lpStakingEth, REWARDS_ADDRESSES["Sushi Swap VEGA/ETH"]),
        ]);
      } catch (e) {
        Sentry.captureException(e);
      }
    };
    if (txStakeState.txState === TxState.Complete) {
      run();
    }
  }, [getBalances, lpStakingEth, lpStakingUSDC, txStakeState.txState]);
  const values = React.useMemo(
    () => state.contractData[lpTokenAddress],
    [lpTokenAddress, state.contractData]
  );
  const maximum = React.useMemo(
    () =>
      BigNumber.min(
        values.connectedWalletData?.availableLPTokens || 0,
        allowance
      ),
    [allowance, values.connectedWalletData?.availableLPTokens]
  );
  const fetchAllowance = React.useCallback(async () => {
    try {
      const allowance = await lpStaking.allowance(ethAddress);
      setAllowance(allowance);
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [ethAddress, lpStaking]);
  React.useEffect(() => {
    if (txApprovalState.txState === TxState.Complete) {
      fetchAllowance();
    }
  }, [lpStaking, ethAddress, fetchAllowance, txApprovalState.txState]);
  React.useEffect(() => {
    fetchAllowance();
  }, [lpStaking, ethAddress, fetchAllowance]);
  let pageContent;
  if (txStakeState.txState !== TxState.Default) {
    pageContent = (
      <TransactionCallout
        state={txStakeState}
        completeHeading={t("depositLpSuccessCalloutTitle")}
        completeBody={t("depositLpSuccessCalloutBody")}
        completeFooter={
          <Link to={Routes.LIQUIDITY}>
            <button className="fill">{t("lpTxSuccessButton")}</button>
          </Link>
        }
        reset={() => txStakeDispatch({ type: TransactionActionType.TX_RESET })}
      />
    );
  } else if (
    values.connectedWalletData?.stakedLPTokens &&
    !values.connectedWalletData?.stakedLPTokens.isEqualTo(0)
  ) {
    pageContent = (
      <p>
        <Trans
          i18nKey="depositLpAlreadyStaked"
          components={{
            withdrawLink: (
              <Link to={`${Routes.LIQUIDITY}/${lpTokenAddress}/withdraw`} />
            ),
          }}
        />
      </p>
    );
  } else {
    pageContent = (
      <>
        {!ethAddress && <EthConnectPrompt />}
        <Callout
          icon={<Error />}
          intent="error"
          title={t("depositLpCalloutTitle")}
        >
          <p>{t("depositLpCalloutBody")}</p>
        </Callout>
        <DexTokensSection
          name={name}
          contractAddress={lpTokenAddress}
          ethAddress={ethAddress}
          state={state}
          showInteractionButton={false}
          dispatch={dispatch}
        />
        <h1>{t("depositLpTokensHeading")}</h1>
        {values.connectedWalletData?.availableLPTokens?.isGreaterThan(0) ? (
          <TokenInput
            submitText={t("depositLpSubmitButton")}
            approveText={t("depositLpApproveButton")}
            requireApproval={true}
            allowance={allowance}
            perform={txStakePerform}
            approve={txApprovalPerform}
            amount={amount}
            setAmount={setAmount}
            maximum={maximum}
            approveTxState={txApprovalState}
            approveTxDispatch={txApprovalDispatch}
            currency={t("SLP Tokens")}
          />
        ) : (
          <p>{t("depositLpInsufficientBalance")}</p>
        )}
      </>
    );
  }

  return <section>{pageContent}</section>;
};

export const LiquidityDeposit = ({
  state,
  dispatch,
}: {
  state: LiquidityState;
  dispatch: React.Dispatch<LiquidityAction>;
}) => {
  const { t } = useTranslation();
  const { address } = useParams<{ address: string }>();

  const isValidAddress = React.useMemo(
    () => Object.values(REWARDS_ADDRESSES).includes(address),
    [address]
  );

  if (!isValidAddress) {
    return <section>{t("lpTokensInvalidToken", { address })}</section>;
  }
  const [name] = Object.entries(REWARDS_ADDRESSES).find(
    ([, a]) => a === address
  )!;

  return (
    <LiquidityDepositPage
      state={state}
      dispatch={dispatch}
      name={name}
      lpTokenAddress={address}
    />
  );
};
