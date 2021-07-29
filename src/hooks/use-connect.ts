import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";

export function useConnect() {
  const { appState, appDispatch, provider } = useAppState();
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
      appDispatch({ type: "CONNECT_SUCCESS", address: accounts[0], chainId });
    } catch (e) {
      appDispatch({ type: "CONNECT_FAIL", error: e });
    }
  }, [appState.hasProvider, appDispatch, provider]);

  return connect;
}
