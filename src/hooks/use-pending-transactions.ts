import uniqBy from "lodash/uniqBy";
import React from "react";

import { useContracts } from "../contexts/contracts/contracts-context";

export const usePendingTransactions = () => {
  const { staking, vesting } = useContracts();
  const [txs, setTxs] = React.useState<
    {
      tx: any;
      receipt: any;
      requiredConfirmations: number;
      pending: boolean;
    }[]
  >([]);

  React.useEffect(() => {
    if (!staking || !vesting) return;
    staking.listen((txs) => {
      setTxs((curr) => {
        return uniqBy([...txs, ...curr], "tx.hash");
      });
    });

    vesting.listen((txs) => {
      setTxs((curr) => {
        return uniqBy([...txs, ...curr], "tx.hash");
      });
    });
  }, [staking, vesting]);

  const pending = React.useMemo(() => {
    return txs.some((tx) => tx.pending);
  }, [txs]);

  return pending;
};
