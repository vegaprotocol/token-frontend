import React from "react";
import { EthereumChainId } from "../../lib/web3-utils";
import type { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { BigNumber } from "../../lib/bignumber";

export enum ProviderStatus {
  Pending,
  Ready,
  None,
}

export interface AppState {
  providerStatus: ProviderStatus;
  address: string | null;
  error: Error | null;
  connecting: boolean;
  chainId: EthereumChainId | null;
  balance: null | BigNumber;
  tranches: Tranche[];
  appChainId: EthereumChainId;
  contractAddresses: {
    vestingAddress: string;
    vegaTokenAddress: string;
    claimAddress: string;
    lockedAddress: string;
  };
}

export type AppStateAction =
  | { type: "PROVIDER_DETECTED"; chainId: EthereumChainId }
  | { type: "PROVIDER_NOT_DETECTED" }
  | { type: "CONNECT" }
  | { type: "DISCONNECT" }
  | {
      type: "CONNECT_SUCCESS";
      address: string;
      chainId: EthereumChainId;
      balance: BigNumber | null;
    }
  | { type: "CONNECT_FAIL"; error: Error }
  | { type: "ACCOUNTS_CHANGED"; address: string }
  | { type: "CHAIN_CHANGED"; chainId: EthereumChainId }
  | { type: "SET_TRANCHES"; tranches: Tranche[] }
  | { type: "APP_CHAIN_CHANGED"; newChainId: EthereumChainId }
  | { type: "SET_BALANCE"; balance: BigNumber };

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
