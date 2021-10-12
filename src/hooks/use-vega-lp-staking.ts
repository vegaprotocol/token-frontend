import React from "react";
import { IVegaLPStaking } from "../lib/web3-utils";
// @ts-ignore
import LPStakingAbi from "../lib/VEGA_WEB3/vega-lp-staking";
import { useWeb3 } from "../contexts/web3-context/web3-context";

/**
 * I think this is actually going to need to export 1x ABI per bridge, i.e. around 4
 */
export const useVegaLPStaking = ({ address }: { address: string }) => {
  const { web3 } = useWeb3();
  return React.useMemo<IVegaLPStaking>(() => {
    return new LPStakingAbi(web3, address);
  }, [web3, address]);
};
