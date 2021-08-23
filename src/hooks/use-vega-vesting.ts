import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
// @ts-ignore
import VegaVesting from "../lib/VEGA_WEB3/vega-vesting";
import { IVegaVesting } from "../lib/web3-utils";

export function useVegaVesting() {
  const {
    provider,
    appState: { contractAddresses, decimals },
  } = useAppState();
  const vesting = React.useMemo<IVegaVesting>(() => {
    const web3 = new Web3(provider);
    return new VegaVesting(web3, contractAddresses.vestingAddress, decimals);
  }, [provider, contractAddresses.vestingAddress, decimals]);
  return vesting;
}
