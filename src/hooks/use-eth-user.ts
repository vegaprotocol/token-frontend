import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useContracts } from "../contexts/contracts/contracts-context";
import { BigNumber } from "../lib/bignumber";
import { useGetUserTrancheBalances } from "./use-get-user-tranche-balances";
import * as Sentry from "@sentry/react";
import { ADDRESSES } from "../config";
import { isUnexpectedError } from "../lib/web3-utils";
import { useLocalStorage } from "./use-local-storage";

const CONNECTED_STORAGE_KEY = "ethereum_wallet_connected";

export function useEthUser() {
  const { appState, appDispatch } = useAppState();
  const { token, staking, vesting } = useContracts();
  const connectTimer = React.useRef<any>();
  const getUserTrancheBalances = useGetUserTrancheBalances(appState.ethAddress);
  const [hasConnected, setHasConnected] = useLocalStorage<boolean | null>(
    CONNECTED_STORAGE_KEY,
    // null indicates not set (initial app start), false indicates
    // user disconnected, and true indicates user connected
    null
  );

  // const connect = React.useCallback(async () => {
  //   let connected = false;

  //   // only show set connecting state if some time has passed to
  //   // avoid UI flickering if you have already permitted the website
  //   // to connect to metamask
  //   connectTimer.current = setTimeout(() => {
  //     if (!connected) {
  //       appDispatch({ type: AppStateActionType.CONNECT });
  //     }
  //   }, 300);

  //   try {
  //     appDispatch({ type: AppStateActionType.CONNECT });

  //     const accounts = await provider.request({
  //       method: "eth_requestAccounts",
  //     });

  //     if (hasConnected !== null && !hasConnected) {
  //       await provider.request({
  //         method: "wallet_requestPermissions",
  //         params: [{ eth_accounts: {} }],
  //       });
  //     }

  //     connected = true;

  //     if (
  //       accounts[0] &&
  //       typeof accounts[0] === "string" &&
  //       accounts[0].length
  //     ) {
  //       appDispatch({
  //         type: AppStateActionType.CONNECT_SUCCESS,
  //         address: accounts[0],
  //       });
  //       Sentry.setUser({ id: accounts[0] });
  //       setHasConnected(true);
  //     } else {
  //       Sentry.captureMessage(
  //         `Invalid eth_requestAccounts return value. Received: ${accounts[0]}`
  //       );
  //     }
  //   } catch (e) {
  //     if (isUnexpectedError(e as Error)) {
  //       Sentry.captureException(e);
  //     }
  //     appDispatch({ type: AppStateActionType.CONNECT_FAIL, error: e as Error });
  //   }
  // }, [appDispatch, provider, hasConnected, setHasConnected]);

  const disconnect = React.useCallback(() => {
    appDispatch({ type: AppStateActionType.DISCONNECT });
    setHasConnected(false);
  }, [appDispatch, setHasConnected]);

  // Auto connect if possible
  // React.useEffect(() => {
  //   if (
  //     hasConnected &&
  //     !appState.ethAddress &&
  //     !appState.error &&
  //     !appState.ethWalletConnecting
  //   ) {
  //     connect();
  //   }
  // }, [
  //   hasConnected,
  //   appState.ethAddress,
  //   appState.ethWalletConnecting,
  //   appState.error,
  //   connect,
  // ]);

  // update balances on connect to Ethereum
  React.useEffect(() => {
    const updateBalances = async () => {
      try {
        const [balance, walletBalance, lien, allowance] = await Promise.all([
          vesting.getUserBalanceAllTranches(appState.ethAddress),
          token.balanceOf(appState.ethAddress),
          vesting.getLien(appState.ethAddress),
          token.allowance(appState.ethAddress, ADDRESSES.stakingBridge),
        ]);
        appDispatch({
          type: AppStateActionType.UPDATE_ACCOUNT_BALANCES,
          balance: new BigNumber(balance),
          walletBalance,
          lien,
          allowance,
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    if (appState.ethAddress) {
      updateBalances();
    }
  }, [appDispatch, appState.ethAddress, staking, token, vesting]);

  // Updates on address change, getUserTrancheBalance has address as a dep
  React.useEffect(() => {
    if (appState.ethAddress) {
      getUserTrancheBalances();
    }
  }, [appState.ethAddress, getUserTrancheBalances]);

  // Clear connect timer on unmount
  React.useEffect(() => {
    return () => {
      if (connectTimer.current) {
        clearTimeout(connectTimer.current);
      }
    };
  }, []);

  return {
    ethAddress: appState.ethAddress,
    // connect,
    disconnect,
  };
}
