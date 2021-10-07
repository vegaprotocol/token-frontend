import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";
import { IVegaStaking } from "../lib/web3-utils";
// @ts-ignore
import StakingAbi from "../lib/VEGA_WEB3/vega-staking";
import { ADDRESSES } from "../config";
import { useWeb3 } from "../contexts/web3-context/web3-context";

export const useVegaStakingOLD = () => {
  const {
    appState: { decimals },
  } = useAppState();
  const { web3 } = useWeb3();
  return React.useMemo<IVegaStaking>(() => {
    return new StakingAbi(web3, ADDRESSES.stakingBridge, decimals);
  }, [web3, decimals]);
};
