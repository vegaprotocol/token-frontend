import React from "react";
import VegaVesting from "../lib/vega-web3/vega-vesting";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";

export function useVegaVesting() {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();
  const vesting = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaVesting(web3, contractAddresses.vestingAddress);
  }, [provider, contractAddresses.vestingAddress]);
  return vesting;
}
