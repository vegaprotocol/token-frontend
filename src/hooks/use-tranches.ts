import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";

export function useTranches() {
  const {
    appState: { tranches },
  } = useAppState();

  return tranches;
}

export function useTranche(id: number | null) {
  const tranches = useTranches();
  const tranche = React.useMemo(() => {
    if (!id || !tranches) return;
    return tranches.find((tranche) => Number(tranche.tranche_id) === id);
  }, [id, tranches]);

  return tranche;
}
