import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { IVegaLPStaking } from "../lib/web3-utils";
// @ts-ignore
import LPStakingAbi from "../lib/VEGA_WEB3/vega-lp-staking";
import { ADDRESSES } from "../config";

export const useVegaLPStaking = () => {
  const {
    provider,
    appState: { decimals },
  } = useAppState();

  return React.useMemo<IVegaLPStaking>(() => {
    const web3 = new Web3(provider);
    return new LPStakingAbi(web3, ADDRESSES.stakingBridge, decimals);
  }, [provider, decimals]);
};
