import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useVegaStaking } from "./use-vega-staking";
import { useVegaWallet } from "./use-vega-wallet";

export function useVegaUser() {
  const { appState, appDispatch } = useAppState();
  const vegaWallet = useVegaWallet();
  const staking = useVegaStaking();

  React.useEffect(() => {
    async function run() {
      const isUp = await vegaWallet.getStatus();
      if (isUp) {
        // dont handle error here, if get key fails just 'log' the user
        // out. Keys will be null and clearing the token is handled by the
        // vegaWalletServices.
        const [, keys] = await vegaWallet.getKeys();
        let vegaAssociatedBalance = null;
        if (appState.address && keys && keys.length) {
          vegaAssociatedBalance = await staking.stakeBalance(
            appState.address,
            keys[0].pub
          );
        }
        appDispatch({
          type: AppStateActionType.VEGA_WALLET_INIT,
          keys,
          vegaAssociatedBalance,
        });
      } else {
        appDispatch({ type: AppStateActionType.VEGA_WALLET_DOWN });
      }
    }

    run();
  }, [appDispatch, appState.address, staking, vegaWallet]);

  return {
    vegaKeys: appState.vegaKeys,
    currVegaKey: appState.currVegaKey,
  };
}
