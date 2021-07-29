import React from "react";
import VegaWeb3 from "../lib/__mocks__/vega-web3";
import { EthereumChainId } from "../lib/vega-web3-utils";

export function useVegaWeb3(chainId: EthereumChainId) {
  const ref = React.useRef<VegaWeb3>(new VegaWeb3(chainId));
  return ref.current;
}
