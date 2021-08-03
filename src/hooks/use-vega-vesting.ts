import React from "react";
import VegaVesting from "../lib/vega-web3/vega-vesting";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { Addresses, IVegaVesting } from "../lib/web3-utils";
import MockedVesting from "../lib/__mocks__/vega-vesting";

export function useVegaVesting() {
  const {
    provider,
    appState: { appChainId },
  } = useAppState();
  const vesting = React.useMemo<IVegaVesting>(() => {
    const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
    const web3 = new Web3(provider);
    return useMocks
      ? new MockedVesting()
      : new VegaVesting(web3, Addresses[appChainId].vestingAddress);
  }, [appChainId, provider]);
  return vesting;
}
