import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { IVegaClaim } from "../lib/web3-utils";
// @ts-ignore
import VegaClaim from "../lib/VEGA_WEB3/vega-claim";

export const useVegaClaim = () => {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();
  const claim = React.useMemo<IVegaClaim>(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, contractAddresses.claimAddress);
  }, [contractAddresses.claimAddress, provider]);
  return claim;
};
