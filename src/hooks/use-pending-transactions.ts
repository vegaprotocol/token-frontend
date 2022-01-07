import React from "react";

import { useContracts } from "../contexts/contracts/contracts-context";

export const usePendingTransactions = () => {
  const { staking } = useContracts();
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (!staking) return;
    staking.watchTransactions((txs) => {
      setPending(txs.some((tx) => tx.pending));
    });
  }, [staking]);

  return pending;
};
