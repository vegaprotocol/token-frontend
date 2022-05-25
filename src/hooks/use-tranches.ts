import { Tranche } from "@vegaprotocol/smart-contracts-sdk";
import React from "react";

import { APP_ENV, Networks } from "../config";
import { BigNumber } from "../lib/bignumber";

const TRANCHES_URLS: { [N in Networks]: string } = {
  MAINNET: "https://static.vega.xyz/assets/mainnet-tranches.json",
  TESTNET: "https://static.vega.xyz/assets/testnet-tranches.json",
  STAGNET: "https://static.vega.xyz/assets/stagnet1-tranches.json",
  STAGNET2: "https://static.vega.xyz/assets/stagnet2-tranches.json",
  DEVNET: "https://static.vega.xyz/assets/devnet-tranches.json",
  CUSTOM: "",
};

export function useTranches() {
  const [tranches, setTranches] = React.useState<Tranche[] | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const url = React.useMemo(() => TRANCHES_URLS[APP_ENV], []);
  React.useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const tranchesJson = await res.json();
        const processedTrances = tranchesJson
          .map((t: Tranche) => ({
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
              // @ts-ignore
              deposits: u.deposits.map((d) => ({
                ...d,
                amount: new BigNumber(d.amount),
              })),
              // @ts-ignore
              withdrawals: u.withdrawals.map((w) => ({
                ...w,
                amount: new BigNumber(w.amount),
              })),
              total_tokens: new BigNumber(u.total_tokens),
              withdrawn_tokens: new BigNumber(u.withdrawn_tokens),
              remaining_tokens: new BigNumber(u.remaining_tokens),
            })),
          }))
          .sort((a: Tranche, b: Tranche) => a.tranche_id - b.tranche_id);
        setTranches(processedTrances);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [setTranches, url]);

  return {
    tranches,
    loading,
    error,
  };
}
