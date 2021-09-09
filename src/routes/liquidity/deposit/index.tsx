import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../../lib/bignumber";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";
import { TokenInput } from "../../../components/token-input";
import { useTranslation } from "react-i18next";
import { useTransaction } from "../../../hooks/use-transaction";
import { TransactionCallout } from "../../../components/transaction-callout";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";

export const LiquidityDepositPage = ({
  lpTokenAddress,
}: {
  lpTokenAddress: string;
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
  const [allowance, setAllowance] = React.useState<BigNumber>(
    new BigNumber("0")
  );
  const [unstakedBalance, setUnstakedBalance] = React.useState("0");
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
  React.useEffect(() => {
    const run = async () => {
      try {
        const balance = await lpStaking.totalUnstaked(ethAddress);
        setUnstakedBalance(balance);
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);
  const maximum = React.useMemo(
    () =>
      BigNumber.min(new BigNumber(unstakedBalance), new BigNumber(allowance!)),
    [allowance, unstakedBalance]
  );
  React.useEffect(() => {
    const run = async () => {
      try {
        const allowance = await lpStaking.allowance(ethAddress);
        setAllowance(new BigNumber(allowance));
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);

  let pageContent;
  if (
    txApprovalState.txState !== TxState.Default &&
    txApprovalState.txState !== TxState.Complete
  ) {
    pageContent = (
      <TransactionCallout
        state={txApprovalState}
        reset={() =>
          txApprovalDispatch({ type: TransactionActionType.TX_RESET })
        }
      />
    );
  } else if (
    txStakeState.txState !== TxState.Default &&
    txStakeState.txState !== TxState.Complete
  ) {
    pageContent = (
      <TransactionCallout
        state={txStakeState}
        reset={() => txStakeDispatch({ type: TransactionActionType.TX_RESET })}
      />
    );
  } else {
    pageContent = (
      <>
        <h1>{t("depositLpTokensHeading")}</h1>
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

export const LiquidityDeposit = () => {
  const { t } = useTranslation();
  const { address } = useParams<{ address: string }>();

  const isValidAddress = React.useMemo(
    () => Object.values(REWARDS_ADDRESSES).includes(address),
    [address]
  );

  if (!isValidAddress) {
    return <section>{t("depositLpTokensInvalidToken", { address })}</section>;
  }
  return <LiquidityDepositPage lpTokenAddress={address} />;
};
