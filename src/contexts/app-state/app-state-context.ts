import React from "react";
import type { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { BigNumber } from "../../lib/bignumber";

export enum ProviderStatus {
  /** Detecting if a Web3 provider is available */
  Pending,
  /** Web3 provider is available */
  Ready,
  /** No Web3 provider not available */
  None,
}

export enum VegaWalletStatus {
  /** Detecting if Vega wallet service is running */
  Pending,
  /** Vega wallet service is running */
  Ready,
  /** No Vega wallet not running */
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

export interface UserTrancheBalance {
  /** ID of tranche */
  id: number;

  /** Users vesting tokens on tranche */
  locked: BigNumber;

  /** Users vested tokens on tranche */
  vested: BigNumber;
}

export interface AppState {
  /** Ethereum address provided by Metamask */
  ethAddress: string;

  /** Error if connecting to Metamask failed */
  error: Error | null;

  /** Whether or not we are awaiting the user to connect in Metamask */
  ethWalletConnecting: boolean;

  /** Users vesting balance across all tranches */
  balanceFormatted: BigNumber;

  /** Users balance of VEGA in Metamask */
  walletBalance: BigNumber;

  /** Amount of tokens associated for a given eth address  */
  lien: BigNumber;

  /** Array of tranche objects */
  tranches: Tranche[] | null;

  /** Number of decimal places of the VEGA token (18 on Mainnet, 5 on Ropsten) */
  decimals: number;

  /** Total supply of VEGA tokens */
  totalSupply: BigNumber;

  /** Total number of VEGA Tokens, both vesting and unlocked, associated for staking */
  totalAssociated: BigNumber;

  /** Users total unlocked tokens */
  totalVestedBalance: BigNumber;

  /** Users total locked (vesting) tokens */
  totalLockedBalance: BigNumber;

  /** Breakdown of users vesting/vested balances across tranches */
  trancheBalances: UserTrancheBalance[];

  /** Approved amount of VEGA to be associated for staking */
  allowance: BigNumber;

  /** Whether or not the connect to Ethereum wallet overaly is open */
  ethWalletOverlay: boolean;

  /** Whether or not the connect to VEGA wallet overaly is open */
  vegaWalletOverlay: boolean;

  /** Whether or not a Vega wallet service is running, can be Pending, Ready or None */
  vegaWalletStatus: VegaWalletStatus;

  /** Array of Vega key objects provided by the Vega wallet service */
  vegaKeys: VegaKeyExtended[] | null;

  /** Current selected Vega key */
  currVegaKey: VegaKeyExtended | null;

  /** Amount of tokens associated with the current Vega key from wallet*/
  walletAssociatedBalance: BigNumber | null;

  /** Amount of tokens associated with the current Vega key from vesting contract*/
  vestingAssociatedBalance: BigNumber | null;

  /** The error if one was thrown during retrieval of tranche data */
  trancheError: Error | null;

  /** Whether or not the mobile drawer is open. Only relevant on screens smaller than 960 */
  drawerOpen: boolean;
}

export enum AppStateActionType {
  CONNECT,
  DISCONNECT,
  CONNECT_SUCCESS,
  CONNECT_FAIL,
  ACCOUNTS_CHANGED,
  UPDATE_ACCOUNT_BALANCES,
  VEGA_WALLET_INIT,
  VEGA_WALLET_SET_KEY,
  VEGA_WALLET_DOWN,
  VEGA_WALLET_DISCONNECT,
  SET_TOKEN,
  SET_ALLOWANCE,
  REFRESH_BALANCES,
  SET_TRANCHE_DATA,
  SET_VEGA_WALLET_OVERLAY,
  SET_ETH_WALLET_OVERLAY,
  SET_DRAWER,
  SET_TRANCHE_ERROR,
}

export type AppStateAction =
  | { type: AppStateActionType.CONNECT }
  | { type: AppStateActionType.DISCONNECT }
  | {
      type: AppStateActionType.CONNECT_SUCCESS;
      address: string;
    }
  | { type: AppStateActionType.CONNECT_FAIL; error: Error }
  | {
      type: AppStateActionType.ACCOUNTS_CHANGED;
      address: string;
    }
  | {
      type: AppStateActionType.UPDATE_ACCOUNT_BALANCES;
      balance: BigNumber;
      walletBalance: BigNumber;
      lien: BigNumber;
      allowance: BigNumber;
    }
  | {
      type: AppStateActionType.VEGA_WALLET_INIT;
      keys: VegaKey[] | null | undefined;
      walletAssociatedBalance: BigNumber | null;
      vestingAssociatedBalance: BigNumber | null;
    }
  | {
      type: AppStateActionType.VEGA_WALLET_SET_KEY;
      key: VegaKeyExtended;
      walletAssociatedBalance: BigNumber | null;
      vestingAssociatedBalance: BigNumber | null;
    }
  | { type: AppStateActionType.VEGA_WALLET_DOWN }
  | { type: AppStateActionType.VEGA_WALLET_DISCONNECT }
  | {
      type: AppStateActionType.SET_TOKEN;
      decimals: number;
      totalSupply: BigNumber;
      totalAssociated: BigNumber;
    }
  | {
      type: AppStateActionType.SET_ALLOWANCE;
      allowance: BigNumber;
    }
  | {
      type: AppStateActionType.REFRESH_BALANCES;
      balance: BigNumber;
      walletBalance: BigNumber;
      lien: BigNumber;
      allowance: BigNumber;
      walletAssociatedBalance: BigNumber | null;
      vestingAssociatedBalance: BigNumber | null;
    }
  | {
      type: AppStateActionType.SET_TRANCHE_DATA;
      trancheBalances: UserTrancheBalance[];
      tranches: Tranche[];
    }
  | {
      type: AppStateActionType.SET_TRANCHE_ERROR;
      error: Error | null;
    }
  | {
      type: AppStateActionType.SET_VEGA_WALLET_OVERLAY;
      isOpen: boolean;
    }
  | {
      type: AppStateActionType.SET_ETH_WALLET_OVERLAY;
      isOpen: boolean;
    }
  | {
      type: AppStateActionType.SET_DRAWER;
      isOpen: boolean;
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
