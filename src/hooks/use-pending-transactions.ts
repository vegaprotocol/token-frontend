import React from "react";

import { useAppState } from "../contexts/app-state/app-state-context";

export const usePendingTransactions = () => {
  const {
    appState: { ethTransactions },
  } = useAppState();

  const pending = React.useMemo(() => {
    return ethTransactions.some((tx) => tx.pending);
  }, [ethTransactions]);

  return pending;
};
