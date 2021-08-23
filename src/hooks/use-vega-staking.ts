import React from "react";
import Web3 from "web3";

import { useAppState } from "../contexts/app-state/app-state-context";
import {IVegaStaking} from "../lib/web3-utils";
import StakingAbi from "../lib/vega-web3/vega-staking";

export const useVegaStaking = () => {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();

  return React.useMemo<IVegaStaking>(() => {
    const web3 = new Web3(provider);
    return new StakingAbi(web3, contractAddresses.stakingBridge, 5);
  }, [contractAddresses.stakingBridge, provider]);
};
