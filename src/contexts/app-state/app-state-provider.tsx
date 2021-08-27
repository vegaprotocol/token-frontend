import React from "react";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { Addresses, EthereumChainId } from "../../lib/web3-utils";
import {
  AppState,
  AppStateContext,
  AppStateAction,
  ProviderStatus,
  AppStateActionType,
  VegaWalletStatus,
} from "./app-state-context";
// @ts-ignore
import detectEthereumProvider from "DETECT_PROVIDER_PATH/detect-provider";
import { truncateMiddle } from "../../lib/truncate-middle";
import { BigNumber } from "../../lib/bignumber";

interface AppStateProviderProps {
  children: React.ReactNode;
}

const initialAppState: AppState = {
  providerStatus: ProviderStatus.Pending,
  address: null,
  connecting: false,
  chainId: null,
  appChainId: process.env.REACT_APP_CHAIN as EthereumChainId,
  error: null,
  balanceFormatted: "",
  walletBalance: "",
  lien: "",
  allowance: "",
  tranches: null,
  contractAddresses: Addresses[process.env.REACT_APP_CHAIN as EthereumChainId],
  vegaWalletStatus: VegaWalletStatus.Pending,
  vegaKeys: null,
  currVegaKey: null,
  totalAssociated: "",
  totalStaked: "",
  decimals: 0,
  totalSupply: null,
  vegaAssociatedBalance: null,
  trancheBalances: [],
  totalLockedBalance: "",
  totalVestedBalance: "",
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case AppStateActionType.PROVIDER_DETECTED:
      return {
        ...state,
        providerStatus: ProviderStatus.Ready,
        chainId: action.chainId,
      };
    case AppStateActionType.PROVIDER_NOT_DETECTED:
      return {
        ...state,
        providerStatus: ProviderStatus.None,
      };
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
        chainId: action.chainId,
        balanceFormatted: action.balance?.toString() || "",
        walletBalance: action.walletBalance?.toString() || "",
        allowance: action.allowance?.toString() || "",
        lien: action.lien?.toString() || "",
        connecting: false,
      };
    case AppStateActionType.CONNECT_FAIL:
      return {
        ...state,
        error: action.error,
        address: null,
        connecting: false,
      };
    case AppStateActionType.DISCONNECT:
      return {
        ...state,
        error: null,
        address: null,
      };
    case AppStateActionType.ACCOUNTS_CHANGED: {
      return {
        ...state,
        address: action.address,
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
    case AppStateActionType.CHAIN_CHANGED: {
      return {
        ...state,
        chainId: action.chainId,
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
  }
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const provider = React.useRef<any>();
  const [state, dispatch] = React.useReducer(appStateReducer, initialAppState);
  // Detect provider
  React.useEffect(() => {
    detectEthereumProvider().then((res: any) => {
      // Extra check helps with Opera's legacy web3 - it properly falls through to NOT_DETECTED
      if (res && res.request) {
        provider.current = res;

        // The line below fails on legacy web3 as the method 'request' does not exist
        provider.current
          .request({ method: "eth_chainId" })
          .then((chainId: string) => {
            dispatch({
              type: AppStateActionType.PROVIDER_DETECTED,
              chainId: chainId as EthereumChainId,
            });
          });
      } else {
        dispatch({ type: AppStateActionType.PROVIDER_NOT_DETECTED });
      }
    });
  }, []);

  if (state.providerStatus === ProviderStatus.Pending) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <AppStateContext.Provider
      value={{
        appState: state,
        appDispatch: dispatch,
        provider: provider.current,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
