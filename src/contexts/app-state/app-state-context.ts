import React from "react";
import { EthereumChainId } from "../../lib/vega-web3-utils";

export interface AppState {
  hasProvider: boolean;
  address: string | null;
  connecting: boolean;
  chainId: EthereumChainId | null;
}

export type AppStateAction =
  | { type: "PROVIDER_DETECTED" }
  | { type: "CONNECT" }
  | { type: "DISCONNECT" }
  | { type: "CONNECT_SUCCESS"; address: string; chainId: EthereumChainId }
  | { type: "CONNECT_FAIL"; error: Error }
  | { type: "ACCOUNTS_CHANGED"; address: string }
  | { type: "CHAIN_CHANGED"; chainId: EthereumChainId };

type AppStateContextShape = {
  appState: AppState;
  appDispatch: React.Dispatch<AppStateAction>;
  provider: any; // TODO: type this
};

export const AppStateContext = React.createContext<
  AppStateContextShape | undefined
>(undefined);

export function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
