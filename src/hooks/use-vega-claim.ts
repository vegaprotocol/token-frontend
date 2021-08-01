import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import VegaClaim from "../lib/vega-web3/vega-claim";
import { Addresses } from "../lib/web3-utils";

export const useVegaClaim = () => {
  const {
    provider,
    appState: { appChainId },
  } = useAppState();
  const claim = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, Addresses[appChainId].claimAddress);
  }, [appChainId, provider]);
  return claim;
};
