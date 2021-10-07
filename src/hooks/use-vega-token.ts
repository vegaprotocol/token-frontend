import React from "react";
import { ADDRESSES } from "../config";
import { useWeb3 } from "../contexts/web3-context/web3-context";
// @ts-ignore VEGA_WEB3 path swapped depending on prod build or test build
import VegaToken from "../lib/VEGA_WEB3/vega-token";
import { IVegaToken } from "../lib/web3-utils";

export function useVegaTokenOLD() {
  const { web3 } = useWeb3();
  return React.useMemo<IVegaToken>(() => {
    return new VegaToken(web3, ADDRESSES.vegaTokenAddress);
  }, [web3]);
}
