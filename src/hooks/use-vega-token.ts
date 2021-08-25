import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
// @ts-ignore VEGA_WEB3 path swapped depending on prod build or test build
import VegaToken from "../lib/VEGA_WEB3/vega-token";
import { IVegaToken } from "../lib/web3-utils";

export function useVegaToken() {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();

  return React.useMemo<IVegaToken>(() => {
    const web3 = new Web3(provider);
    return new VegaToken(web3, contractAddresses.vegaTokenAddress);
  }, [contractAddresses.vegaTokenAddress, provider]);
}
