import React from "react";
import VegaVesting from "../lib/vega-web3/vega-vesting";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { Addresses } from "../lib/web3-utils";

export function useVegaVesting() {
  const {
    provider,
    appState: { appChainId },
  } = useAppState();
  // TODO make mocks work again
  // const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
  const vesting = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaVesting(web3, Addresses[appChainId].vestingAddress);
  }, [appChainId, provider]);
  const ref = React.useRef(vesting);
  return ref.current;
}
