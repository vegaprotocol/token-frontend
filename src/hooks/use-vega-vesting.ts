import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { Decimals } from "../lib/web3-utils";
import VegaVesting from "../lib/VEGA_WEB3/vega-vesting";
import { IVegaVesting } from "../lib/web3-utils";

export function useVegaVesting() {
  const {
    provider,
    appState: { contractAddresses, chainId },
  } = useAppState();
  const vesting = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaVesting(
      web3,
      contractAddresses.vestingAddress,
      Decimals[chainId!]
    );
  }, [provider, contractAddresses.vestingAddress, chainId]);
  return vesting;
}
