import React from "react";
import { useAppState } from "../contexts/app-state/app-state-context";
import { EthereumChainIds } from "../lib/vega-web3-utils";
import { useVegaWeb3 } from "./use-vega-web3";

const mockAddress = "0x" + "0".repeat(0);

export function useConnect() {
  const { appState, appDispatch, provider } = useAppState();
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
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

      appDispatch({
        type: "CONNECT_SUCCESS",
        address: accounts[0],
        chainId: vega.chainId,
        balance,
      });
    } catch (e) {
      console.log(e);
      appDispatch({ type: "CONNECT_FAIL", error: e });
    }
  }, [appDispatch, appState.hasProvider, provider, useMocks, vega]);

  return connect;
}
