import React from "react";
import { IVegaClaim } from "../lib/web3-utils";
// @ts-ignore
import VegaClaim from "../lib/VEGA_WEB3/vega-claim";
import { ADDRESSES } from "../config";
import { useWeb3 } from "./use-web3";

export const useVegaClaim = () => {
  const web3 = useWeb3();
  const claim = React.useMemo<IVegaClaim>(() => {
    return new VegaClaim(web3, ADDRESSES.claimAddress);
  }, [web3]);
  return claim;
};
