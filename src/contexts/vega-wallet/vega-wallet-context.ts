import React from "react";
import { BigNumber } from "../../lib/bignumber";

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

export interface VegaWalletState {
  /** Whether or not a Vega wallet service is running, can be Pending, Ready or None */
  status: VegaWalletStatus;

  /** Array of Vega key objects provided by the Vega wallet service */
  keys: VegaKeyExtended[] | null;

  /** Current selected Vega key */
  currKey: VegaKeyExtended | null;
}

export enum VegaWalletActionType {
  INIT,
  SET_KEY,
  DOWN,
  DISCONNECT,
}

export type VegaWalletAction =
  | {
      type: VegaWalletActionType.INIT;
      keys: VegaKey[] | null | undefined;
      walletAssociatedBalance: BigNumber | null;
      vestingAssociatedBalance: BigNumber | null;
    }
  | {
      type: VegaWalletActionType.SET_KEY;
      key: VegaKeyExtended;
      walletAssociatedBalance: BigNumber | null;
      vestingAssociatedBalance: BigNumber | null;
    }
  | { type: VegaWalletActionType.DOWN }
  | { type: VegaWalletActionType.DISCONNECT };

export interface VegaWalletContextShape {
  vegaWalletState: VegaWalletState;
  vegaWalletDispatch: React.Dispatch<VegaWalletAction>;
}

export const VegaWalletContext = React.createContext<
  VegaWalletContextShape | undefined
>(undefined);

export function useVegaWallet() {
  const context = React.useContext(VegaWalletContext);
  if (context === undefined) {
    throw new Error("useVegaWallet must be used within VegaWalletProvider");
  }
  return context;
}
