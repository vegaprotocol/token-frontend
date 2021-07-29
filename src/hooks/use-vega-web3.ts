import React from "react";
import VegaWeb3Mock from "../lib/__mocks__/vega-web3";
import { EthereumChainId } from "../lib/vega-web3-utils";
import VegaWeb3 from "../lib/vega-web3";
import { IVegaWeb3 } from "../lib/vega-web3-types";

export function useVegaWeb3(chainId: EthereumChainId) {
  const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
  const Vega = useMocks ? VegaWeb3Mock : VegaWeb3;
  const ref = React.useRef<IVegaWeb3>(new Vega(chainId));
  return ref.current;
}
