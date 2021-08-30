import React from "react";
import { VegaWalletService } from "../lib/vega-wallet/vega-wallet-service";

export function useVegaWallet() {
  const vegaWalletService = React.useRef(new VegaWalletService());
  return vegaWalletService.current;
}
