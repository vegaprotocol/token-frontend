import React from "react";
import VegaVesting from "../lib/vega-web3/vega-vesting";
import Web3 from "web3";

export function useVegaVesting() {
  // TODO how do I access the provider if wallet not connected?
  const provider = React.useMemo(
    () =>
      new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/5aff9e61ad844bcf982d0d0c3f1d29f1"
      ),
    []
  );
  // TODO make mocks work again
  // const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
  const vesting = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaVesting(web3, "0x23d1bFE8fA50a167816fBD79D7932577c06011f4");
  }, [provider]);
  const ref = React.useRef(vesting);
  return ref.current;
}
