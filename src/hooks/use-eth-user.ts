import React from "react";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useVegaStaking } from "./use-vega-staking";
import { useVegaToken } from "./use-vega-token";
import { useVegaVesting } from "./use-vega-vesting";
import { BigNumber } from "../lib/bignumber";
import { EthereumChainId } from "../lib/web3-utils";

export function useEthUser() {
  const { appState, appDispatch, provider } = useAppState();
  const token = useVegaToken();
  const staking = useVegaStaking();
  const vesting = useVegaVesting();
  const connectTimer = React.useRef<any>();
  // const [triedToConnect, setTriedToConnect] = React.useState<boolean>(false);

  // React.useEffect(() => {
  //   // Auto connect if possible
  //   if (
  //     !triedToConnect &&
  //     // If we haven't loaded the contract information don't connect yet
  //     appState.tokenDataLoaded &&
  //     // We don't have an address we are not connected
  //     !appState.address &&
  //     // If we have an error we don't want to try reconnecting
  //     !appState.error &&
  //     // If we are connecting we don't want to try to connect
  //     !appState.connecting &&
  //     // @ts-ignore
  //     (window.ethereum || (window.web3 && window.web3.currentProvider))
  //   ) {
  //     try {
  //       setTriedToConnect(true);
  //       connect();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }, [
  //   appState.address,
  //   appState.connecting,
  //   appState.error,
  //   appState.tokenDataLoaded,
  //   connect,
  //   triedToConnect,
  // ]);
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

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      connected = true;

      appDispatch({
        type: AppStateActionType.CONNECT_SUCCESS,
        address: accounts[0],
      });
    } catch (e) {
      // Sentry.captureEvent(e);
      appDispatch({ type: AppStateActionType.CONNECT_FAIL, error: e });
    }
  }, [appDispatch, provider]);

  React.useEffect(() => {
    const updateBalances = async () => {
      const [balance, walletBalance, lien, allowance] = await Promise.all([
        vesting.getUserBalanceAllTranches(appState.address),
        token.balanceOf(appState.address),
        vesting.getLien(appState.address),
        token.allowance(
          appState.address,
          appState.contractAddresses.stakingBridge
        ),
      ]);
      appDispatch({
        type: AppStateActionType.UPDATE_ACCOUNT_BALANCES,
        balance: new BigNumber(balance),
        walletBalance,
        lien,
        allowance,
      });
    };

    if (appState.address) {
      updateBalances();
    }
  }, [
    appDispatch,
    appState.address,
    appState.contractAddresses.stakingBridge,
    provider,
    staking,
    token,
    vesting,
  ]);

  // Clear connect timer on unmount
  React.useEffect(() => {
    return () => {
      if (connectTimer.current) {
        clearTimeout(connectTimer.current);
      }
    };
  }, []);

  return {
    address: appState.address,
    connect,
  };
}
