import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import VegaTokenAbi from "../lib/vega-web3/vega-token";

export function useVegaToken() {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();

  return React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaTokenAbi(web3, contractAddresses.vegaTokenAddress);
  }, [contractAddresses.vegaTokenAddress, provider]);
}
