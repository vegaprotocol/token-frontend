import React from "react";
import { ADDRESSES } from "../config";
import { useAppState } from "../contexts/app-state/app-state-context";
import { useWeb3 } from "../contexts/web3-context/web3-context";
// @ts-ignore
import VegaVesting from "../lib/VEGA_WEB3/vega-vesting";
import { IVegaVesting } from "../lib/web3-utils";

export function useVegaVesting() {
  const {
    appState: { decimals },
  } = useAppState();
  const { web3 } = useWeb3();
  const vesting = React.useMemo<IVegaVesting>(() => {
    return new VegaVesting(web3, ADDRESSES.vestingAddress, decimals);
  }, [web3, decimals]);
  return vesting;
}
