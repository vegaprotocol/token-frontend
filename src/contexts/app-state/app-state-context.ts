import React from "react";
import { EthereumChainId } from "../../lib/web3-utils";
import type { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { BigNumber } from "../../lib/bignumber";

export enum ProviderStatus {
  Pending,
  Ready,
  None,
}

export enum VegaWalletStatus {
  Pending,
  Ready,
  None,
}

export interface VegaKey {
  pub: string;
  algo: string;
  tainted: boolean;
  meta: Array<{ key: string; value: string }> | null;
}

export interface VegaKeyExtended extends VegaKey {
  alias: string;
  pubShort: string;
}

export interface AppState {
  providerStatus: ProviderStatus;
  address: string | null;
  error: Error | null;
  connecting: boolean;
  chainId: EthereumChainId | null;
  balanceFormatted: string;
  tranches: Tranche[] | null;
  appChainId: EthereumChainId;
  decimals: number;
  totalSupply: BigNumber | null;
  totalSupplyFormatted: string;
  totalStaked: BigNumber | null;
  totalStakedFormatted: string;
  contractAddresses: {
    vestingAddress: string;
    vegaTokenAddress: string;
    claimAddress: string;
    lockedAddress: string;
    stakingBridge: string;
  };
  vegaWalletStatus: VegaWalletStatus;
  vegaKeys: VegaKeyExtended[] | null;
  currVegaKey: VegaKeyExtended | null;
}

export enum AppStateActionType {
  PROVIDER_DETECTED,
  PROVIDER_NOT_DETECTED,
  CONNECT,
  DISCONNECT,
  CONNECT_SUCCESS,
  CONNECT_FAIL,
  ACCOUNTS_CHANGED,
  CHAIN_CHANGED,
  SET_TRANCHES,
  SET_BALANCE,
  VEGA_WALLET_INIT,
  VEGA_WALLET_SET_KEY,
  VEGA_WALLET_DOWN,
  VEGA_WALLET_DISCONNECT,
  SET_TOKEN,
}

export type AppStateAction =
  | { type: AppStateActionType.PROVIDER_DETECTED; chainId: EthereumChainId }
  | { type: AppStateActionType.PROVIDER_NOT_DETECTED }
  | { type: AppStateActionType.CONNECT }
  | { type: AppStateActionType.DISCONNECT }
  | {
      type: AppStateActionType.CONNECT_SUCCESS;
      address: string;
      chainId: EthereumChainId;
      balance: BigNumber | null;
    }
  | { type: AppStateActionType.CONNECT_FAIL; error: Error }
  | { type: AppStateActionType.ACCOUNTS_CHANGED; address: string }
  | { type: AppStateActionType.CHAIN_CHANGED; chainId: EthereumChainId }
  | { type: AppStateActionType.SET_TRANCHES; tranches: Tranche[] }
  | { type: AppStateActionType.SET_BALANCE; balance: BigNumber }
  | {
      type: AppStateActionType.VEGA_WALLET_INIT;
      keys: VegaKey[] | null | undefined;
    }
  | { type: AppStateActionType.VEGA_WALLET_SET_KEY; key: VegaKeyExtended }
  | { type: AppStateActionType.VEGA_WALLET_DOWN }
  | { type: AppStateActionType.VEGA_WALLET_DISCONNECT }
  | {
      type: AppStateActionType.SET_TOKEN;
      decimals: number;
      totalSupply: BigNumber;
    };

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
