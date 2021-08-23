import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useVegaVesting } from "./use-vega-vesting";

export function useTranches() {
  const {
    appState: { address, tranches },
    appDispatch,
  } = useAppState();
  const [loading, setLoading] = React.useState(true);
  const vesting = useVegaVesting();

  const getTrancheData = React.useCallback(async () => {
    const tranches = await vesting.getAllTranches();
    let trancheBalances;

    // if we have an address get the users tranche balances
    if (address) {
      const userTranches = tranches.filter((t) =>
        t.users.some(
          ({ address: a }) => a.toLowerCase() === address.toLowerCase()
        )
      );

      const promises = userTranches.map(async (t) => {
        const [total, vested] = await Promise.all([
          vesting.userTrancheTotalBalance(address, t.tranche_id),
          vesting.userTrancheVestedBalance(address, t.tranche_id),
        ]);
        return {
          id: t.tranche_id,
          locked: total.minus(vested),
          vested,
        };
      });

      trancheBalances = await Promise.all(promises);
    }

    appDispatch({
      type: AppStateActionType.SET_TRANCHE_DATA,
      trancheBalances,
      tranches,
    });
    setLoading(false);
  }, [address, vesting, appDispatch]);

  React.useEffect(() => {
    getTrancheData();
  }, [getTrancheData]);

  return {
    loading,
    tranches: tranches,
    refreshTranches: getTrancheData,
  };
}
