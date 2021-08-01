import React from "react";
import VegaVesting from "../lib/vega-web3/vega-vesting";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";

export function useVegaVesting() {
  const { provider } = useAppState();
  // TODO make mocks work again
  // const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
  const vesting = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaVesting(web3, "0x08C06ECDCf9b8f45e3cF1ec29B82eFd0171341D9");
  }, [provider]);
  const ref = React.useRef(vesting);
  return ref.current;
}
