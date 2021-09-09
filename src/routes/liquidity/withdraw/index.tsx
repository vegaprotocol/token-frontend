import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";
import { useTranslation } from "react-i18next";
import { useTransaction } from "../../../hooks/use-transaction";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";
import { TransactionCallout } from "../../../components/transaction-callout";
import * as Sentry from "@sentry/react";
import BigNumber from "bignumber.js";

export const LiquidityWithdrawPage = ({
  lpTokenAddress,
}: {
  lpTokenAddress: string;
}) => {
  const { t } = useTranslation();
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
  const { ethAddress } = useEthUser();
  const {
    state: txUnstakeState,
    dispatch: txUnstakeDispatch,
    perform: txUnstakePerform,
  } = useTransaction(() => lpStaking.unstake(ethAddress));
  // TODO get from reducer state
  const [unstakedBalance, setUnstakedBalance] = React.useState("0");
  const transactionInProgress = React.useMemo(
    () => txUnstakeState.txState !== TxState.Default,
    [txUnstakeState.txState]
  );
  React.useEffect(() => {
    const run = async () => {
      try {
        const stakedBalance = await lpStaking.stakedBalance(ethAddress);
        setUnstakedBalance(stakedBalance);
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);

  if (new BigNumber(unstakedBalance).isEqualTo(0)) {
    return <section>{t("withdrawLpNoneDeposited")}</section>;
  }

  return (
    <section>
      {transactionInProgress ? (
        <TransactionCallout
          state={txUnstakeState}
          reset={() =>
            txUnstakeDispatch({ type: TransactionActionType.TX_RESET })
          }
        />
      ) : (
        <button className="fill" onClick={txUnstakePerform}>
          {t("withdrawLpWithdrawButton")}
        </button>
      )}
    </section>
  );
};

export const LiquidityWithdraw = () => {
  const { t } = useTranslation();
  const { address } = useParams<{ address: string }>();

  const isValidAddress = React.useMemo(
    () => Object.values(REWARDS_ADDRESSES).includes(address),
    [address]
  );

  if (!isValidAddress) {
    return <section>{t("lpTokensInvalidToken", { address })}</section>;
  }
  return <LiquidityWithdrawPage lpTokenAddress={address} />;
};
