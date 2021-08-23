import React from "react";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useVegaVesting } from "./use-vega-vesting";
import * as Sentry from "@sentry/react";
import { BigNumber } from "../lib/bignumber";
import { useVegaToken } from "./use-vega-token";
import { EthereumChainId } from "../lib/web3-utils";

export function useEthereumUser() {
  const { appState, appDispatch, provider } = useAppState();
  const connectTimer = React.useRef<any>();
  const vesting = useVegaVesting();
  const token = useVegaToken();
  const [triedToConnect, setTriedToConnect] = React.useState<boolean>(false);

  const setUserData = React.useCallback(
    async (accounts: string[]) => {
      if (accounts.length) {
        const [balance, walletBalance, lien, allowance] = await Promise.all([
          vesting.getUserBalanceAllTranches(accounts[0]),
          token.balanceOf(accounts[0]),
          vesting.getLien(accounts[0]),
          token.allowance(
            accounts[0],
            appState.contractAddresses.stakingBridge
          ),
        ]);
        appDispatch({
          type: AppStateActionType.ACCOUNTS_CHANGED,
          address: accounts[0],
          balance: new BigNumber(balance),
          walletBalance,
          lien,
          allowance,
        });
      } else {
        appDispatch({ type: AppStateActionType.DISCONNECT });
      }
    },
    [appDispatch, token, vesting, appState.contractAddresses.stakingBridge]
  );

  const connect = React.useCallback(async () => {
    let connected = false;

    // only show set connecting state if some time has passed to
    // avoid UI flickering if you have already permitted the website
    // to connect to metamask
    connectTimer.current = setTimeout(() => {
      if (!connected) {
        appDispatch({ type: AppStateActionType.CONNECT });
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

      const [accounts, chainId]: [string[], EthereumChainId] =
        await Promise.all([
          provider.request({ method: "eth_requestAccounts" }),
          provider.request({ method: "eth_chainId" }),
        ]);
      await setUserData(accounts);
      connected = true;
      appDispatch({
        type: AppStateActionType.CONNECT_SUCCESS,
        address: accounts[0],
        chainId,
      });
    } catch (e) {
      console.log(e);
      Sentry.captureEvent(e);
      appDispatch({ type: AppStateActionType.CONNECT_FAIL, error: e });
    }
  }, [appDispatch, appState.providerStatus, provider, setUserData]);

  React.useEffect(() => {
    return () => {
      if (connectTimer.current) {
        clearTimeout(connectTimer.current);
      }
    };
  }, []);

  // Bind listeners for account change
  React.useEffect(() => {
    if (
      appState.tokenDataLoaded &&
      appState.providerStatus === ProviderStatus.Ready
    ) {
      provider.on("accountsChanged", (accounts: string[]) => {
        setUserData(accounts);
      });
      provider.on("chainChanged", (chainId: EthereumChainId) => {
        appDispatch({ type: AppStateActionType.CHAIN_CHANGED, chainId });
      });
    }
  }, [
    provider,
    appState.providerStatus,
    appState.tokenDataLoaded,
    appDispatch,
    setUserData,
  ]);

  React.useEffect(() => {
    // Auto connect if possible
    if (
      !triedToConnect &&
      // If we haven't loaded the contract information don't connect yet
      // appState.tokenDataLoaded &&
      // We don't have an address we are not connected
      !appState.address &&
      // If we have an error we don't want to try reconnecting
      !appState.error &&
      // If we are connecting we don't want to try to connect
      !appState.connecting &&
      // @ts-ignore
      (window.ethereum || (window.web3 && window.web3.currentProvider))
    ) {
      try {
        setTriedToConnect(true);
        connect();
      } catch (e) {
        console.log(e);
      }
    }
  }, [
    appState.address,
    appState.connecting,
    appState.error,
    appState.tokenDataLoaded,
    connect,
    triedToConnect,
  ]);

  return {
    address: appState.address,
    connect,
  };
}
