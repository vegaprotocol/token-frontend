import React from "react";
import {
  ProviderStatus,
  useAppState,
} from "../contexts/app-state/app-state-context";
import {
  EthereumChainId,
  EthereumChainIds,
  EthereumChainNames,
} from "../lib/web3-utils";
import { useVegaVesting } from "./use-vega-vesting";
import * as Sentry from "@sentry/react";
import BigNumber from "bignumber.js";

const mockAddress = "0x" + "0".repeat(0);

export function useConnect() {
  const { appState, appDispatch, provider } = useAppState();
  const appConfigChainId = process.env.REACT_APP_CHAIN as EthereumChainId;
  if (!EthereumChainNames[appConfigChainId]) {
    throw new Error("Could not find chain ID from environment");
  }
  const vega = useVegaVesting();
  const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
  const connect = React.useCallback(async () => {
    try {
      appDispatch({ type: "CONNECT" });

      if (appState.providerStatus === ProviderStatus.None) {
        appDispatch({
          type: "CONNECT_FAIL",
          error: new Error("No provider"),
        });
        return;
      }

      let accounts: string[];
      let chainId: EthereumChainId;
      if (useMocks) {
        const confirm = true; // TOOD
        if (confirm) {
          accounts = [mockAddress];
        } else {
          throw new Error("Connection rejected");
        }
        chainId = EthereumChainIds.Ropsten;
      } else {
        accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        chainId = await provider.request({ method: "eth_chainId" });
      }
      const balance = await vega.getUserBalanceAllTranches(accounts[0]);

      appDispatch({
        type: "CONNECT_SUCCESS",
        address: accounts[0],
        chainId,
        balance: new BigNumber(balance),
      });
    } catch (e) {
      Sentry.captureEvent(e);
      appDispatch({ type: "CONNECT_FAIL", error: e });
    }
  }, [appDispatch, appState.providerStatus, provider, useMocks, vega]);

  return connect;
}
