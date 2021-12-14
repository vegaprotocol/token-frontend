import React from "react";

import { useContracts } from "../../contexts/contracts/contracts-context";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import mock from './tranches-mock';

export function useTranches() {
  const { vesting } = useContracts();
  const [tranches, setTranches] = React.useState<Tranche[]>([]);

  React.useEffect(() => {
    const run = async () => {
      setTranches(mock);
    };
    run();
  }, [vesting]);

  return tranches;
}
