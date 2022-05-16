import { Tranche } from "@vegaprotocol/smart-contracts-sdk";
import React from "react";

import { BigNumber } from "../lib/bignumber";
import tranchesJson from "./tranches.json";

export function useTranches() {
  const [tranches, setTranches] = React.useState<Tranche[] | null>(null);

  React.useEffect(() => {
    const processedTrances = tranchesJson
      .map((t) => ({
        ...t,
        tranche_start: new Date(t.tranche_start),
        tranche_end: new Date(t.tranche_end),
        total_added: new BigNumber(t.total_added),
        total_removed: new BigNumber(t.total_removed),
        locked_amount: new BigNumber(t.locked_amount),
        deposits: t.deposits.map((d) => ({
          ...d,
          amount: new BigNumber(d.amount),
        })),
        withdrawals: t.withdrawals.map((w) => ({
          ...w,
          amount: new BigNumber(w.amount),
        })),
        users: t.users.map((u) => ({
          ...u,
          deposits: u.deposits.map((d) => ({
            ...d,
            amount: new BigNumber(d.amount),
          })),
          withdrawals: u.withdrawals.map((w) => ({
            ...w,
            amount: new BigNumber(w.amount),
          })),
          total_tokens: new BigNumber(u.total_tokens),
          withdrawn_tokens: new BigNumber(u.withdrawn_tokens),
          remaining_tokens: new BigNumber(u.remaining_tokens),
        })),
      }))
      .sort((a, b) => a.tranche_id - b.tranche_id);
    setTranches(processedTrances);
  }, [tranches]);

  return {
    tranches,
  };
}
