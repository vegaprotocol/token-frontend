import React from "react";
import { Addresses, EthereumChainId } from "../../lib/web3-utils";
import {
  AppState,
  AppStateContext,
  AppStateAction,
  AppStateActionType,
  VegaWalletStatus,
} from "./app-state-context";

import { truncateMiddle } from "../../lib/truncate-middle";
import { BigNumber } from "../../lib/bignumber";
import * as Sentry from "@sentry/react";
import { Severity } from "@sentry/react";

interface AppStateProviderProps {
  provider: any;
  chainId: EthereumChainId;
  children: React.ReactNode;
}

const initialAppState: AppState = {
  chainId: process.env.REACT_APP_CHAIN as EthereumChainId,
  // set in app-loader TODO: update when user stakes/unstakes/associates/disassociates
  totalAssociated: "",
  totalStaked: "",
  decimals: 0,
  totalSupply: "",
  address: "",
  connecting: false,
  error: null,
  balanceFormatted: "",
  walletBalance: "",
  lien: "",
  allowance: "",
  tranches: null,
  contractAddresses: Addresses[process.env.REACT_APP_CHAIN as EthereumChainId],
  ethWalletOverlay: false,
  vegaWalletOverlay: false,
  vegaWalletStatus: VegaWalletStatus.Pending,
  vegaKeys: null,
  currVegaKey: null,

  vegaAssociatedBalance: null,
  trancheBalances: [],
  totalLockedBalance: "",
  totalVestedBalance: "",
  trancheError: null,
  drawerOpen: false,
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case AppStateActionType.CONNECT:
      return {
        ...state,
        error: null,
        connecting: true,
      };
    case AppStateActionType.CONNECT_SUCCESS:
      return {
        ...state,
        address: action.address,
        connecting: false,
        ethWalletOverlay: false,
      };
    case AppStateActionType.CONNECT_FAIL:
      return {
        ...state,
        error: action.error,
        address: "",
        connecting: false,
      };
    case AppStateActionType.DISCONNECT:
      return {
        ...state,
        error: null,
        address: "",
      };
    case AppStateActionType.ACCOUNTS_CHANGED: {
      return {
        ...state,
        address: action.address,
      };
    }
    case AppStateActionType.UPDATE_ACCOUNT_BALANCES: {
      return {
        ...state,
        balanceFormatted: action.balance?.toString() || "",
        walletBalance: action.walletBalance?.toString() || "",
        allowance: action.allowance?.toString() || "",
        lien: action.lien?.toString() || "",
      };
    }
    case AppStateActionType.REFRESH_BALANCES: {
      return {
        ...state,
        balanceFormatted: action.balance?.toString() || "",
        walletBalance: action.walletBalance?.toString() || "",
        allowance: action.allowance?.toString() || "",
        lien: action.lien?.toString() || "",
        vegaAssociatedBalance: action.vegaAssociatedBalance?.toString() || "",
      };
    }
    case AppStateActionType.VEGA_WALLET_INIT: {
      if (!action.keys) {
        return { ...state, vegaWalletStatus: VegaWalletStatus.Ready };
      }

      const vegaKeys = action.keys.map((k) => {
        const alias = k.meta?.find((m) => m.key === "alias");
        return {
          ...k,
          alias: alias?.value || "No alias",
          pubShort: truncateMiddle(k.pub),
        };
      });
      return {
        ...state,
        vegaKeys,
        currVegaKey: vegaKeys.length ? vegaKeys[0] : null,
        vegaWalletStatus: VegaWalletStatus.Ready,
        vegaAssociatedBalance: action.vegaAssociatedBalance?.toString() || null,
      };
    }
    case AppStateActionType.VEGA_WALLET_SET_KEY: {
      return {
        ...state,
        currVegaKey: action.key,
        vegaAssociatedBalance: action.vegaAssociatedBalance?.toString() || null,
      };
    }
    case AppStateActionType.VEGA_WALLET_DOWN: {
      return {
        ...state,
        vegaWalletStatus: VegaWalletStatus.None,
      };
    }
    case AppStateActionType.VEGA_WALLET_DISCONNECT: {
      return {
        ...state,
        currVegaKey: null,
        vegaKeys: null,
      };
    }
    case AppStateActionType.SET_TOKEN: {
      return {
        ...state,
        decimals: action.decimals,
        totalSupply: action.totalSupply,
        totalAssociated: action.totalAssociated.toString(),
      };
    }
    case AppStateActionType.SET_ALLOWANCE: {
      return {
        ...state,
        allowance: action.allowance?.toString() || "",
      };
    }
    case AppStateActionType.SET_TRANCHE_DATA:
      return {
        ...state,
        tranches: action.tranches,
        totalVestedBalance: BigNumber.sum
          .apply(null, [
            new BigNumber(0),
            ...action.trancheBalances.map((b) => b.vested),
          ])
          .toString(),
        totalLockedBalance: BigNumber.sum
          .apply(null, [
            new BigNumber(0),
            ...action.trancheBalances.map((b) => b.locked),
          ])
          .toString(),
        trancheBalances: action.trancheBalances,
      };
    case AppStateActionType.SET_TRANCHE_ERROR: {
      return {
        ...state,
        trancheError: action.error,
      };
    }
    case AppStateActionType.SET_VEGA_WALLET_OVERLAY: {
      return {
        ...state,
        vegaWalletOverlay: action.isOpen,
        drawerOpen: action.isOpen ? false : state.drawerOpen,
      };
    }
    case AppStateActionType.SET_ETH_WALLET_OVERLAY: {
      return {
        ...state,
        ethWalletOverlay: action.isOpen,
        drawerOpen: action.isOpen ? false : state.drawerOpen,
      };
    }
    case AppStateActionType.SET_DRAWER: {
      return {
        ...state,
        drawerOpen: action.isOpen,
        ethWalletOverlay: false,
        vegaWalletOverlay: false,
      };
    }
  }
}

export function AppStateProvider({
  children,
  provider,
  chainId,
}: AppStateProviderProps) {
  const [state, dispatch] = React.useReducer(appStateReducer, {
    ...initialAppState,
    chainId,
  });

  React.useEffect(() => {
    provider.on("accountsChanged", (accounts: string[]) => {
      Sentry.addBreadcrumb({
        type: "AccountsChanged",
        level: Severity.Log,
        message: "User changed accounts in wallet provider",
        data: {
          old: state.address,
          new: accounts[0],
        },
        timestamp: Date.now(),
      });
      Sentry.setUser({ id: accounts[0] });
      dispatch({
        type: AppStateActionType.ACCOUNTS_CHANGED,
        address: accounts[0],
      });
    });
    return () => {
      provider.removeAllListeners("accountsChanged");
    };
  }, [provider, state.address]);

  return (
    <AppStateContext.Provider
      value={{
        appState: state,
        appDispatch: dispatch,
        provider,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
