import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { IVegaLPStaking } from "../lib/web3-utils";
// @ts-ignore
import LPStakingAbi from "../lib/VEGA_WEB3/vega-lp-staking";

/**
 * I think this is actually going to need to export 1x ABI per bridge, i.e. around 4
 */
export const useVegaLPStaking = ({ address }: { address: string }) => {
  const { provider } = useAppState();

  return React.useMemo<IVegaLPStaking>(() => {
    const web3 = new Web3(provider);
    return new LPStakingAbi(web3, address);
  }, [provider, address]);
};
