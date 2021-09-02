import React from "react";
import { Tranche } from "../lib/vega-web3/vega-web3-types";
import { useVegaVesting } from "./use-vega-vesting";

export function useTranches() {
  const vesting = useVegaVesting();
  const [tranches, setTranches] = React.useState<Tranche[]>([]);

  React.useEffect(() => {
    const run = async () => {
      const res = await vesting.getAllTranches();
      setTranches(res);
    };
    run();
  }, [vesting]);

  return tranches;
}
