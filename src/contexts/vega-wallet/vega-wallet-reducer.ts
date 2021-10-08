import { truncateMiddle } from "../../lib/truncate-middle";
import {
  VegaWalletAction,
  VegaWalletActionType,
  VegaWalletState,
  VegaWalletStatus,
} from "./vega-wallet-context";

export function vegaWalletReducer(
  state: VegaWalletState,
  action: VegaWalletAction
): VegaWalletState {
  switch (action.type) {
    case VegaWalletActionType.INIT: {
      if (!action.keys) {
        return { ...state, status: VegaWalletStatus.Ready };
      }

      const keys = action.keys.map((k) => {
        const alias = k.meta?.find((m) => m.key === "alias");
        return {
          ...k,
          alias: alias?.value || "No alias",
          pubShort: truncateMiddle(k.pub),
        };
      });
      return {
        ...state,
        keys,
        currKey: keys.length ? keys[0] : null,
        status: VegaWalletStatus.Ready,
        // walletAssociatedBalance: action.walletAssociatedBalance,
        // vestingAssociatedBalance: action.vestingAssociatedBalance,
      };
    }
    case VegaWalletActionType.SET_KEY: {
      return {
        ...state,
        currKey: action.key,
        // walletAssociatedBalance: action.walletAssociatedBalance,
        // vestingAssociatedBalance: action.vestingAssociatedBalance,
      };
    }
    case VegaWalletActionType.DOWN: {
      return {
        ...state,
        status: VegaWalletStatus.None,
      };
    }
    case VegaWalletActionType.DISCONNECT: {
      return {
        ...state,
        currKey: null,
        keys: null,
      };
    }
  }
}
