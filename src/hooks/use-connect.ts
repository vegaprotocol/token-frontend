import React from "react";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { EthereumChainId, EthereumChainNames } from "../lib/web3-utils";
import { useVegaVesting } from "./use-vega-vesting";
import * as Sentry from "@sentry/react";
import { BigNumber } from "../lib/bignumber";

export function useConnect() {
  const connectTimer = React.useRef<any>();
  const { appState, appDispatch, provider } = useAppState();
  const appConfigChainId = process.env.REACT_APP_CHAIN as EthereumChainId;
  if (!EthereumChainNames[appConfigChainId]) {
    throw new Error("Could not find chain ID from environment");
  }
  const vega = useVegaVesting();
  const connect = React.useCallback(async () => {
    let connected = false;

    // only show set connecting state if some time has passed to
    // avoid UI flickering if you have already permitted the website
    // to connect to metamask
    connectTimer.current = setTimeout(() => {
      if (!connected) {
        appDispatch({ type: "CONNECT" });
      }
    }, 300);

    try {
      appDispatch({ type: AppStateActionType.CONNECT });

      if (appState.providerStatus === ProviderStatus.None) {
        appDispatch({
          type: AppStateActionType.CONNECT_FAIL,
          error: new Error("No provider"),
        });
        return;
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await provider.request({ method: "eth_chainId" });
      const balance = await vega.getUserBalanceAllTranches(accounts[0]);

      connected = true;
      appDispatch({
        type: AppStateActionType.CONNECT_SUCCESS,
        address: accounts[0],
        chainId,
        balance: new BigNumber(balance),
      });
    } catch (e) {
      Sentry.captureEvent(e);
      appDispatch({ type: AppStateActionType.CONNECT_FAIL, error: e });
    }
  }, [appDispatch, appState.providerStatus, provider, vega]);

  React.useEffect(() => {
    return () => {
      if (connectTimer.current) {
        clearTimeout(connectTimer.current);
      }
    };
  }, []);

  return connect;
}
