import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";
import { useTransaction } from "../../../hooks/use-transaction";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../../components/eth-connect-prompt";

import "./withdraw.scss";
import { LiquidityAction, LiquidityState } from "../liquidity-reducer";

export const LiquidityWithdrawPage = ({
  lpTokenAddress,
  state,
}: {
  lpTokenAddress: string;
  state: LiquidityState;
  dispatch: React.Dispatch<LiquidityAction>;
}) => {
  const { t } = useTranslation();
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
  const { ethAddress } = useEthUser();
  const {
    state: txUnstakeState,
    dispatch: txUnstakeDispatch,
    perform: txUnstakePerform,
  } = useTransaction(() => lpStaking.unstake(ethAddress));
  const transactionInProgress = React.useMemo(
    () => txUnstakeState.txState !== TxState.Default,
    [txUnstakeState.txState]
  );
  const values = state.contractData[lpTokenAddress];

  if (!values.stakedLPTokens || values.stakedLPTokens.isEqualTo(0)) {
    return <section>{t("withdrawLpNoneDeposited")}</section>;
  }

  return (
    <section>
      {!ethAddress && <EthConnectPrompt />}
      {transactionInProgress ? (
        <TransactionCallout
          state={txUnstakeState}
          reset={() =>
            txUnstakeDispatch({ type: TransactionActionType.TX_RESET })
          }
        />
      ) : (
        <section>
          <p>{t("lpTokenWithdrawSubmit")}</p>
          <table className="dex-tokens-withdraw__table">
            <tbody>
              <tr>
                <th>{t("liquidityTokenWithdrawBalance")}</th>
                <td>{values.stakedLPTokens.toString()}</td>
              </tr>
              <tr>
                <th>{t("liquidityTokenWithdrawRewards")}</th>
                <td>{values.accumulatedRewards!.toString()}</td>
              </tr>
            </tbody>
          </table>
          <p className="dex-tokens-withdraw__submit">
            <button className="fill" onClick={txUnstakePerform}>
              {t("withdrawLpWithdrawButton")}
            </button>
          </p>
        </section>
      )}
    </section>
  );
};

export const LiquidityWithdraw = ({
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
  return (
    <LiquidityWithdrawPage
      lpTokenAddress={address}
      state={state}
      dispatch={dispatch}
    />
  );
};
