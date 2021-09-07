import React from "react";
import * as Sentry from "@sentry/react";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useVegaStaking } from "./use-vega-staking";
import { useVegaWallet } from "./use-vega-wallet";
import { useVegaVesting } from "./use-vega-vesting";

export function useVegaUser() {
  const { appState, appDispatch } = useAppState();
  const vegaWallet = useVegaWallet();
  const staking = useVegaStaking();
  const vesting = useVegaVesting();

  React.useEffect(() => {
    async function run() {
      try {
        const isUp = await vegaWallet.getStatus();
        if (isUp) {
          // dont handle error here, if get key fails just 'log' the user
          // out. Keys will be null and clearing the token is handled by the
          // vegaWalletServices.
          const [, keys] = await vegaWallet.getKeys();
          let walletAssociatedBalance = null;
          let vestingAssociatedBalance = null;
          if (appState.ethAddress && keys && keys.length) {
            walletAssociatedBalance = await staking.stakeBalance(
              appState.ethAddress,
              keys[0].pub
            );
            vestingAssociatedBalance = await vesting.stakeBalance(
              appState.ethAddress,
              keys[0].pub
            );
          }
          appDispatch({
            type: AppStateActionType.VEGA_WALLET_INIT,
            keys,
            walletAssociatedBalance,
            vestingAssociatedBalance,
          });
        } else {
          appDispatch({ type: AppStateActionType.VEGA_WALLET_DOWN });
        }
      } catch (err) {
        Sentry.captureException(err);
      }
    }

    run();
  }, [appDispatch, appState.ethAddress, staking, vegaWallet, vesting]);

  return {
    vegaKeys: appState.vegaKeys,
    currVegaKey: appState.currVegaKey,
  };
}
