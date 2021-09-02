import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Colors } from "../../../colors";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";
import { useGetUserTrancheBalances } from "../../../hooks/use-get-user-tranche-balances";
import { useRefreshBalances } from "../../../hooks/use-refresh-balances";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { BigNumber } from "../../../lib/bignumber";
import { Routes } from "../../router-config";
import { RedemptionState } from "../redemption-reducer";
import { TrancheTable } from "../tranche-table";

export const RedeemFromTranche = ({
  state,
  address,
}: {
  state: RedemptionState;
  address: string;
}) => {
  const vesting = useVegaVesting();
  const { t } = useTranslation();
  const {
    appState: {
      lien,
      totalVestedBalance,
      trancheBalances,
      totalLockedBalance,
      contractAddresses,
    },
  } = useAppState();
  const refreshBalances = useRefreshBalances(address);
  const getUserTrancheBalances = useGetUserTrancheBalances(address);
  const { id } = useParams<{ id: string }>();
  const numberId = Number(id);
  const { userTranches } = state;
  const tranche = React.useMemo(
    () => userTranches.find(({ tranche_id }) => tranche_id === numberId),
    [numberId, userTranches]
  );
  const {
    state: txState,
    perform,
    dispatch: txDispatch,
  } = useTransaction(
    () => vesting.withdrawFromTranche(address, numberId),
    () => vesting.checkWithdrawFromTranche(address, numberId)
  );
  const redeemedAmount = React.useMemo(() => {
    return trancheBalances.find(
      ({ id: bId }) => bId.toString() === id.toString()
    )!.vested;
    // TODO needs some explination
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // If the claim has been committed refetch the new VEGA balance
  React.useEffect(() => {
    if (txState.txState === TxState.Complete && address) {
      getUserTrancheBalances();
      refreshBalances();
    }
  }, [address, getUserTrancheBalances, refreshBalances, txState.txState]);

  if (!tranche || tranche.total_removed.isEqualTo(tranche.total_added)) {
    return (
      <section data-testid="redemption-page">
        <div data-testid="redemption-no-balance">
          {t(
            "You do not have any vesting VEGA tokens. Switch to another Ethereum key to check what can be redeemed."
          )}
        </div>
      </section>
    );
  }
  // TODO needs some translations
  return (
    <section className="redemption-tranche" data-testid="redemption-tranche">
      {txState.txState !== TxState.Default ? (
        <TransactionCallout
          completeHeading={
            <strong style={{ color: Colors.WHITE }}>
              Tokens from this Tranche have been redeemed
            </strong>
          }
          completeFooter={
            <>
              <p>
                You have redeemed {redeemedAmount.toString()} VEGA tokens from
                this tranche. They are now free to transfer from your ethereum
                wallet.
              </p>
              <p>
                The VEGA token address is {contractAddresses.vegaTokenAddress},
                make sure you add this to your wallet to see your tokens
              </p>
              <p>
                Go to <Link to={Routes.STAKING}>staking</Link> or{" "}
                <Link to={Routes.GOVERNANCE}>governance</Link> to see how you
                can use your unlocked tokens
              </p>
            </>
          }
          state={txState}
          reset={() => txDispatch({ type: TransactionActionType.TX_RESET })}
        />
      ) : (
        <TrancheTable
          totalVested={new BigNumber(totalVestedBalance)}
          totalLocked={new BigNumber(totalLockedBalance)}
          tranche={tranche}
          lien={new BigNumber(lien)}
          locked={
            trancheBalances.find(
              ({ id: bId }) => bId.toString() === id.toString()
            )!.locked
          }
          vested={
            trancheBalances.find(
              ({ id: bId }) => bId.toString() === id.toString()
            )!.vested
          }
          onClick={perform}
        />
      )}
    </section>
  );
};
