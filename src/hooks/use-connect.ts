import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";
import { EthereumChainId, EthereumChainNames } from "../lib/web3-utils";
import { useVegaWeb3 } from "./use-vega-web3";

const mockAddress = "0x" + "0".repeat(0);

export function useConnect() {
  const { appState, appDispatch, provider } = useAppState();
  const appConfigChainId = process.env.REACT_APP_CHAIN as EthereumChainId;
  if (!EthereumChainNames[appConfigChainId]) {
    throw new Error("Could not find chain ID from environment");
  }
  const vega = useVegaWeb3(appConfigChainId);
  const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
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

      let accounts: string[];
      if (useMocks) {
        const confirm = window.confirm("Connect");
        if (confirm) {
          accounts = [mockAddress];
        } else {
          throw new Error("Connection rejected");
        }
      } else {
        accounts = await provider.request({
          method: "eth_requestAccounts",
        });
      }
      const balance = await vega.getUserBalanceAllTranches(accounts[0]);
      const chainId = await provider.request({ method: "eth_chainId" });

      appDispatch({
        type: "CONNECT_SUCCESS",
        address: accounts[0],
        chainId,
        balance,
      });
    } catch (e) {
      console.log(e);
      appDispatch({ type: "CONNECT_FAIL", error: e });
    }
  }, [appDispatch, appState.hasProvider, provider, useMocks, vega]);

  return connect;
}
