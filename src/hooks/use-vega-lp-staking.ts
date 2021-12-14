import { ethers } from "ethers";
import React from "react";

import { useWeb3 } from "../contexts/web3-context/web3-context";
import LPStakingAbi from "../lib/vega-web3/vega-lp-staking";
import { IVegaLPStaking } from "../lib/web3-utils";

/**
 * I think this is actually going to need to export 1x ABI per bridge, i.e. around 4
 */
export const useVegaLPStaking = ({ address }: { address: string }) => {
  const { provider, signer } = useWeb3();
  return React.useMemo<IVegaLPStaking>(() => {
    return new LPStakingAbi(
      provider as ethers.providers.Web3Provider,
      signer as ethers.Signer,
      address
    );
  }, [provider, signer, address]);
};
