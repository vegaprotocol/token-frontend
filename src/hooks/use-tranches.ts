import React from "react";
import * as Sentry from "@sentry/react";
import { Tranche } from "../lib/vega-web3/vega-web3-types";
import { useVegaVesting } from "./use-vega-vesting";

export function useTranches() {
  const vesting = useVegaVesting();
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
