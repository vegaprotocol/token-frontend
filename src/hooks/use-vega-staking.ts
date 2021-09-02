import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { IVegaStaking } from "../lib/web3-utils";
// @ts-ignore
import StakingAbi from "../lib/VEGA_WEB3/vega-staking";

export const useVegaStaking = () => {
  const {
    provider,
    appState: { contractAddresses, decimals },
  } = useAppState();

  return React.useMemo<IVegaStaking>(() => {
    const web3 = new Web3(provider);
    return new StakingAbi(web3, contractAddresses.stakingBridge, decimals);
  }, [contractAddresses.stakingBridge, provider, decimals]);
};
