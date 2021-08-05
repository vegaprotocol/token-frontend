import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import VegaClaim from "../lib/vega-web3/vega-claim";

export const useVegaClaim = () => {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();
  const claim = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, contractAddresses.claimAddress);
  }, [provider, contractAddresses.claimAddress]);
  return claim;
};
