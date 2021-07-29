import detectEthereumProvider from "@metamask/detect-provider";
import React from "react";
import { EthereumChainId } from "../../lib/vega-web3-utils";
import { AppState, AppStateContext, AppStateAction } from "./app-state-context";

interface AppStateProviderProps {
  children: React.ReactNode;
}

const initialAppState: AppState = {
  hasProvider: false,
  address: null,
  connecting: false,
  chainId: null,
  error: null,
};

function appStateReducer(state: AppState, action: AppStateAction) {
  switch (action.type) {
    case "PROVIDER_DETECTED":
      return {
        ...state,
        hasProvider: true,
      };
    case "CONNECT":
      return {
        ...state,
        error: null,
        connecting: true,
      };
    case "CONNECT_SUCCESS":
      return {
        ...state,
        address: action.address,
        chainId: action.chainId,
        connecting: false,
      };
    case "CONNECT_FAIL":
      return {
        ...state,
        error: action.error,
        address: null,
        connecting: false,
      };
    case "DISCONNECT":
      return {
        ...state,
        error: null,
        address: null,
      };
    case "ACCOUNTS_CHANGED": {
      return {
        ...state,
        address: action.address,
      };
    }
    case "CHAIN_CHANGED": {
      return {
        ...state,
        chainId: action.chainId,
      };
    }
    default:
      return state;
  }
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const provider = React.useRef<any>();

  const [state, dispatch] = React.useReducer(appStateReducer, initialAppState);

  // Detect provider
  React.useEffect(() => {
    detectEthereumProvider().then((res) => {
      if (res !== null) {
        provider.current = res;
        dispatch({ type: "PROVIDER_DETECTED" });
      }
    });
  }, []);

  // Bind listeners for account change
  React.useEffect(() => {
    if (state.hasProvider) {
      provider.current.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length) {
          dispatch({ type: "ACCOUNTS_CHANGED", address: accounts[0] });
        } else {
          dispatch({ type: "DISCONNECT" });
        }
      });
      provider.current.on("chainChanged", (chainId: EthereumChainId) => {
        dispatch({ type: "CHAIN_CHANGED", chainId });
      });
    }
  }, [state.hasProvider]);

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
