import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";
import { EthereumChainIds } from "../lib/vega-web3-utils";
import { useVegaWeb3 } from "./use-vega-web3";

export function useConnect() {
  const { appState, appDispatch, provider } = useAppState();
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
  const connect = React.useCallback(async () => {
    try {
      appDispatch({ type: "CONNECT" });

      if (!appState.hasProvider) {
        appDispatch({
          type: "CONNECT_FAIL",
          error: new Error("No provider"),
        });
        return;
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await provider.request({ method: "eth_chainId" });
      const res = await vega.getUserBalanceAllTranches();
      appDispatch({
        type: "CONNECT_SUCCESS",
        address: accounts[0],
        chainId,
        balance: res,
      });
    } catch (e) {
      appDispatch({ type: "CONNECT_FAIL", error: e });
    }
  }, [appDispatch, appState.hasProvider, provider, vega]);

  return connect;
}
