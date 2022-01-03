import React from "react";

import LPStakingAbi from "../lib/vega-web3/vega-lp-staking";
import { useWeb3 } from "./use-web3";

/**
 * I think this is actually going to need to export 1x ABI per bridge, i.e. around 4
 */
export const useVegaLPStaking = ({ address }: { address: string }) => {
  const { library } = useWeb3();
  return React.useMemo(() => {
    return new LPStakingAbi(library, library, address);
  }, [library, address]);
};
