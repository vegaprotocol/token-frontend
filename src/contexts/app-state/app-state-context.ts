import React from "react";
import { EthereumChainId } from "../../lib/vega-web3-utils";
import type { Tranche } from "../../lib/vega-web3-types";
export interface AppState {
  hasProvider: boolean;
  address: string | null;
  error: Error | null;
  connecting: boolean;
  chainId: EthereumChainId | null;
  balance: null | string;
  tranches: Tranche[];
}

export type AppStateAction =
  | { type: "PROVIDER_DETECTED" }
  | { type: "CONNECT" }
  | { type: "DISCONNECT" }
  | {
      type: "CONNECT_SUCCESS";
      address: string;
      chainId: EthereumChainId;
      balance: string | null;
    }
  | { type: "CONNECT_FAIL"; error: Error }
  | { type: "ACCOUNTS_CHANGED"; address: string }
  | { type: "CHAIN_CHANGED"; chainId: EthereumChainId }
  | { type: "SET_TRANCHES"; tranches: Tranche[] };

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
