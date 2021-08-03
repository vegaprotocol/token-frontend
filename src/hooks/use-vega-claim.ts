import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import VegaClaim from "../lib/vega-web3/vega-claim";
import { Addresses, IVegaClaim } from "../lib/web3-utils";
import MockedVegaClaim from "../lib/__mocks__/vega-claim";

export const useVegaClaim = () => {
  const {
    provider,
    appState: { appChainId },
  } = useAppState();
  const claim = React.useMemo<IVegaClaim>(() => {
    const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
    const web3 = new Web3(provider);
    return useMocks
      ? new MockedVegaClaim()
      : new VegaClaim(web3, Addresses[appChainId].claimAddress);
  }, [appChainId, provider]);
  return claim;
};
