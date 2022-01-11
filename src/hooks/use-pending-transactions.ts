import React from "react";

import { useContracts } from "../contexts/contracts/contracts-context";

export const usePendingTransactions = () => {
  const { staking } = useContracts();
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (!staking) return;
    staking.listen((txs: any) => {
      setPending(txs.some((tx: any) => tx.pending));
    });
  }, [staking]);

  return pending;
};
