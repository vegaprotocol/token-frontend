import React from "react";
import {
  AppState,
  AppStateContext,
  AppStateAction,
  AppStateActionType,
  VegaWalletStatus,
} from "./app-state-context";

import { useWeb3 } from "../web3-context/web3-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import { BigNumber } from "../../lib/bignumber";
import * as Sentry from "@sentry/react";
import { Severity } from "@sentry/react";

interface AppStateProviderProps {
  children: React.ReactNode;
}

const initialAppState: AppState = {
  // set in app-loader TODO: update when user stakes/unstakes/associates/disassociates
  totalAssociated: new BigNumber(0),
  decimals: 0,
  totalSupply: new BigNumber(0),
  ethAddress: "",
  ethWalletConnecting: false,
  error: null,
  balanceFormatted: new BigNumber(0),
  walletBalance: new BigNumber(0),
  lien: new BigNumber(0),
  allowance: new BigNumber(0),
  tranches: null,
  ethWalletOverlay: false,
  vegaWalletOverlay: false,
  vegaWalletStatus: VegaWalletStatus.Pending,
  vegaKeys: null,
  currVegaKey: null,
  walletAssociatedBalance: null,
  vestingAssociatedBalance: null,
  trancheBalances: [],
  totalLockedBalance: new BigNumber(0),
  totalVestedBalance: new BigNumber(0),
  trancheError: null,
  drawerOpen: false,
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case AppStateActionType.CONNECT:
      return {
        ...state,
        error: null,
        ethWalletConnecting: true,
      };
    case AppStateActionType.CONNECT_SUCCESS:
      return {
        ...state,
        ethAddress: action.address,
        ethWalletConnecting: false,
        ethWalletOverlay: false,
      };
    case AppStateActionType.CONNECT_FAIL:
      return {
        ...state,
        error: action.error,
        ethAddress: "",
        ethWalletConnecting: false,
      };
    case AppStateActionType.DISCONNECT:
      return {
        ...state,
        error: null,
        ethWalletConnecting: false,
        ethAddress: "",
      };
    case AppStateActionType.ACCOUNTS_CHANGED: {
      return {
        ...state,
        ethAddress: action.address,
      };
    }
    case AppStateActionType.UPDATE_ACCOUNT_BALANCES: {
      return {
        ...state,
        balanceFormatted: action.balance,
        walletBalance: action.walletBalance,
        allowance: action.allowance,
        lien: action.lien,
      };
    }
    case AppStateActionType.REFRESH_BALANCES: {
      return {
        ...state,
        balanceFormatted: action.balance,
        walletBalance: action.walletBalance,
        allowance: action.allowance,
        lien: action.lien,
        walletAssociatedBalance: action.walletAssociatedBalance,
        vestingAssociatedBalance: action.vestingAssociatedBalance,
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
      };
    }
    case AppStateActionType.VEGA_WALLET_SET_KEY: {
      return {
        ...state,
        currVegaKey: action.key,
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
        totalAssociated: action.totalAssociated,
      };
    }
    case AppStateActionType.SET_ALLOWANCE: {
      return {
        ...state,
        allowance: action.allowance,
      };
    }
    case AppStateActionType.SET_TRANCHE_DATA:
      return {
        ...state,
        tranches: action.tranches,
        totalVestedBalance: BigNumber.sum.apply(null, [
          new BigNumber(0),
          ...action.trancheBalances.map((b) => b.vested),
        ]),
        totalLockedBalance: BigNumber.sum.apply(null, [
          new BigNumber(0),
          ...action.trancheBalances.map((b) => b.locked),
        ]),
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
    case AppStateActionType.REFRESH_ASSOCIATED_BALANCES: {
      return {
        ...state,
        walletAssociatedBalance: action.walletAssociatedBalance,
        vestingAssociatedBalance: action.vestingAssociatedBalance,
      };
    }
  }
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const { provider } = useWeb3();
  const [state, dispatch] = React.useReducer(appStateReducer, initialAppState);

  React.useEffect(() => {
    provider.on("accountsChanged", (accounts: string[]) => {
      Sentry.addBreadcrumb({
        type: "AccountsChanged",
        level: Severity.Log,
        message: "User changed accounts in wallet provider",
        data: {
          old: state.ethAddress,
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
  }, [provider, state.ethAddress]);

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
