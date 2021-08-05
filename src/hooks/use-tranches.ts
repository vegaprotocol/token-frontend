import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";
import { useVegaVesting } from "./use-vega-vesting";

export function useTranches() {
  const vesting = useVegaVesting();

  const {
    appState: { tranches },
    appDispatch,
  } = useAppState();

  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: "SET_TRANCHES", tranches });
    };
    run();
  }, [appDispatch, vesting]);

  return tranches;
}

export function useTranche(id: number | null) {
  const tranches = useTranches();
  const tranche = React.useMemo(() => {
    if (!id) return;
    return tranches.find((tranche) => tranche.tranche_id === id);
  }, [id, tranches]);

  return tranche;
}
