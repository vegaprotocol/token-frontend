import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
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
    appState: { lien, totalVestedBalance, trancheBalances, totalLockedBalance },
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

  return (
    <section className="redemption-tranche" data-testid="redemption-tranche">
      {txState.txState !== TxState.Default ? (
        <TransactionCallout
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
