import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import VegaClaim from "../lib/vega-web3/vega-claim";

export const useVegaClaim = () => {
  const { provider } = useAppState();
  const claim = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21");
  }, [provider]);
  return claim;
};
