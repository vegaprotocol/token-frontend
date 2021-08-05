import detectEthereumProvider from "@metamask/detect-provider";
import React from "react";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import {
  Addresses,
  EthereumChainId,
  EthereumChainIds,
} from "../../lib/web3-utils";
import {
  AppState,
  AppStateContext,
  AppStateAction,
  ProviderStatus,
} from "./app-state-context";

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
  balance: null,
  tranches: [],
  contractAddresses: Addresses[process.env.REACT_APP_CHAIN as EthereumChainId],
};

function appStateReducer(state: AppState, action: AppStateAction) {
  switch (action.type) {
    case "APP_CHAIN_CHANGED":
      return {
        ...state,
        appChainId: action.newChainId,
        contractAddresses: Addresses[action.newChainId],
      };
    case "PROVIDER_DETECTED":
      return {
        ...state,
        providerStatus: ProviderStatus.Ready,
        chainId: action.chainId,
      };
    case "PROVIDER_NOT_DETECTED":
      return {
        ...state,
        providerStatus: ProviderStatus.None,
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
        balance: action.balance,
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
    case "SET_TRANCHES": {
      return {
        ...state,
        tranches: action.tranches,
      };
    }
    case "SET_BALANCE": {
      return {
        ...state,
        balance: action.balance,
      };
    }
    default:
      return state;
  }
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const provider = React.useRef<any>();
  const useMocks = ["1", "true"].includes(process.env.REACT_APP_MOCKED!);
  const [state, dispatch] = React.useReducer(appStateReducer, initialAppState);

  // Detect provider
  React.useEffect(() => {
    if (useMocks) {
      provider.current = {
        on() {},
      };
      dispatch({
        type: "PROVIDER_DETECTED",
        chainId: EthereumChainIds.Ropsten,
      });
    } else {
      detectEthereumProvider().then((res) => {
        if (res !== null) {
          provider.current = res;
          provider.current
            .request({ method: "eth_chainId" })
            .then((chainId: string) => {
              dispatch({
                type: "PROVIDER_DETECTED",
                chainId: chainId as EthereumChainId,
              });
            });
        } else {
          dispatch({ type: "PROVIDER_NOT_DETECTED" });
        }
      });
    }
  }, [useMocks]);

  // Bind listeners for account change
  React.useEffect(() => {
    if (state.providerStatus === ProviderStatus.Ready) {
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
  }, [state.providerStatus]);

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
