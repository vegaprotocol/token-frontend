import React from "react";
import * as Sentry from "@sentry/react";
import { Tranche } from "../lib/vega-web3/vega-web3-types";
import { useContracts } from "../contexts/contracts/contracts-context";

export function useTranches() {
  const { vesting } = useContracts();
  const [tranches, setTranches] = React.useState<Tranche[]>([]);

  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await vesting.getAllTranches();
        setTranches(res);
      } catch (err) {
        Sentry.captureException(err);
      }
    };
    run();
  }, [vesting]);

  return tranches;
}
