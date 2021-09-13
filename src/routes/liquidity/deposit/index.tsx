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
  const values = state.contractData[lpTokenAddress];
  const maximum = React.useMemo(
    () => BigNumber.min(values?.availableLPTokens || 0, allowance),
    [allowance, values?.availableLPTokens]
  );
  React.useEffect(() => {
    const run = async () => {
      try {
        const allowance = await lpStaking.allowance(ethAddress);
        setAllowance(allowance);
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);
  let pageContent;
  if (
    txApprovalState.txState !== TxState.Default &&
    txStakeState.txState !== TxState.Complete
  ) {
    pageContent = (
      <TransactionCallout
        state={txApprovalState}
        reset={() =>
          txApprovalDispatch({ type: TransactionActionType.TX_RESET })
        }
      />
    );
  } else if (txStakeState.txState !== TxState.Default) {
    pageContent = (
      <TransactionCallout
        state={txStakeState}
        reset={() => txStakeDispatch({ type: TransactionActionType.TX_RESET })}
      />
    );
  } else if (values?.stakedLPTokens && !values.stakedLPTokens.isEqualTo(0)) {
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
        <DexTokensSection
          name={name}
          contractAddress={lpTokenAddress}
          ethAddress={ethAddress}
          state={state}
          showInteractionButton={false}
          dispatch={dispatch}
        />
        <h1>{t("depositLpTokensHeading")}</h1>
        {values?.availableLPTokens?.isGreaterThan(0) ? (
          <TokenInput
            submitText={t("depositLpSubmitButton", { address: lpTokenAddress })}
            approveText={t("depositLpApproveButton", {
              address: lpTokenAddress,
            })}
            requireApproval={true}
            allowance={allowance}
            perform={txStakePerform}
            approve={txApprovalPerform}
            amount={amount}
            setAmount={setAmount}
            maximum={maximum}
          />
        ) : (
          <p>{t("depositLpInsufficientBalance")}</p>
        )}
      </>
    );
  }

  return (
    <section>
      <p>{t("depositLpTokensDescription")}</p>
      {pageContent}
    </section>
  );
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
