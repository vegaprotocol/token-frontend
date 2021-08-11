import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { Flags } from "../flags";
import VegaClaim from "../lib/vega-web3/vega-claim";
import { IVegaClaim } from "../lib/web3-utils";
import MockedVegaClaim from "../lib/__mocks__/vega-claim";

export const useVegaClaim = () => {
  const {
    provider,
    appState: { contractAddresses },
  } = useAppState();
  const claim = React.useMemo<IVegaClaim>(() => {
    const web3 = new Web3(provider);
    return Flags.MOCK
      ? new MockedVegaClaim()
      : new VegaClaim(web3, contractAddresses.claimAddress);
  }, [contractAddresses.claimAddress, provider]);
  return claim;
};
