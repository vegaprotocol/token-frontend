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

export interface TrancheBalance {
  id: number;
  locked: BigNumber;
  vested: BigNumber;
}

export interface AppState {
  providerStatus: ProviderStatus;
  address: string | null;
  error: Error | null;
  connecting: boolean;
  chainId: EthereumChainId | null;
  balanceFormatted: string;
  walletBalance: string;
  lien: string;
  tranches: Tranche[] | null;
  appChainId: EthereumChainId;
  decimals: number;
  totalSupply: string | null;
  totalAssociated: string;
  totalStaked: string;
  totalVestedBalance: string;
  totalLockedBalance: string;
  trancheBalances: TrancheBalance[];
  allowance: string | null;
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
  vegaAssociatedBalance: string | null;
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
  SET_ALLOWANCE,
  REFRESH_BALANCES,
  SET_TRANCHE_BALANCES,
}

export type AppStateAction =
  | { type: AppStateActionType.PROVIDER_DETECTED; chainId: EthereumChainId }
  | { type: AppStateActionType.PROVIDER_NOT_DETECTED }
  | { type: AppStateActionType.CONNECT }
  | { type: AppStateActionType.DISCONNECT }
  | {
      type: AppStateActionType.CONNECT_SUCCESS;
      chainId: EthereumChainId;
      address: string;
      balance: BigNumber | null;
      walletBalance: BigNumber | null;
      lien: BigNumber | null;
      allowance: BigNumber | null;
    }
  | { type: AppStateActionType.CONNECT_FAIL; error: Error }
  | {
      type: AppStateActionType.ACCOUNTS_CHANGED;
      address: string;
      balance: BigNumber | null;
      walletBalance: BigNumber | null;
      lien: BigNumber | null;
      allowance: BigNumber | null;
    }
  | { type: AppStateActionType.CHAIN_CHANGED; chainId: EthereumChainId }
  | { type: AppStateActionType.SET_TRANCHES; tranches: Tranche[] }
  | { type: AppStateActionType.SET_BALANCE; balance: BigNumber }
  | {
      type: AppStateActionType.VEGA_WALLET_INIT;
      keys: VegaKey[] | null | undefined;
      vegaAssociatedBalance: BigNumber | null;
    }
  | {
      type: AppStateActionType.VEGA_WALLET_SET_KEY;
      key: VegaKeyExtended;
      vegaAssociatedBalance: BigNumber | null;
    }
  | { type: AppStateActionType.VEGA_WALLET_DOWN }
  | { type: AppStateActionType.VEGA_WALLET_DISCONNECT }
  | {
      type: AppStateActionType.SET_TOKEN;
      decimals: number;
      totalSupply: string;
      totalAssociated: BigNumber;
    }
  | {
      type: AppStateActionType.SET_ALLOWANCE;
      allowance: BigNumber | null;
    }
  | {
      type: AppStateActionType.REFRESH_BALANCES;
      balance: BigNumber | null;
      walletBalance: BigNumber | null;
      lien: BigNumber | null;
      allowance: BigNumber | null;
      vegaAssociatedBalance: BigNumber | null;
    }
  | {
      type: AppStateActionType.SET_TRANCHE_BALANCES;
      trancheBalances: TrancheBalance[];
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
