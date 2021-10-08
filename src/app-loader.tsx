import React from "react";
import * as Sentry from "@sentry/react";
import { SplashLoader } from "./components/splash-loader";
import { SplashScreen } from "./components/splash-screen";
import {
  AppStateActionType,
  useAppState,
} from "./contexts/app-state/app-state-context";
import { Errors as VegaWalletServiceErrors } from "./lib/vega-wallet/vega-wallet-service";
import { useContracts } from "./contexts/contracts/contracts-context";
import { useVegaWalletService } from "./hooks/use-vega-wallet-service";
import {
  useVegaWallet,
  VegaWalletActionType,
} from "./contexts/vega-wallet/vega-wallet-context";

export const AppLoader = ({ children }: { children: React.ReactElement }) => {
  const { appState, appDispatch } = useAppState();
  const { vegaWalletDispatch } = useVegaWallet();
  const { token, staking, vesting } = useContracts();
  const vegaWalletService = useVegaWalletService();
  const [balancesLoaded, setBalancesLoaded] = React.useState(false);
  const [vegaKeysLoaded, setVegaKeysLoaded] = React.useState(false);

  // Derive loaded state from all things that we want to load or attempted
  // to load before rendering the app
  const loaded = balancesLoaded && vegaKeysLoaded;

  React.useEffect(() => {
    const run = async () => {
      try {
        const [
          supply,
          totalAssociatedWallet,
          totalAssociatedVesting,
          decimals,
        ] = await Promise.all([
          token.totalSupply(),
          staking.totalStaked(),
          vesting.totalStaked(),
          token.decimals(),
        ]);
        appDispatch({
          type: AppStateActionType.SET_TOKEN,
          decimals,
          totalSupply: supply,
          totalAssociated: totalAssociatedWallet.plus(totalAssociatedVesting),
        });
        setBalancesLoaded(true);
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [token, appDispatch, staking, vesting]);

  // Attempte to get vega keys on startup
  React.useEffect(() => {
    async function run() {
      const [err, keys] = await vegaWalletService.getKeys();

      // attempt to load keys complete
      setVegaKeysLoaded(true);

      if (err === VegaWalletServiceErrors.NO_TOKEN) {
        // Do nothing so user has to auth again, but our load for vega keys is complete
        return;
      }

      if (err === VegaWalletServiceErrors.SERVICE_UNAVAILABLE) {
        vegaWalletDispatch({ type: VegaWalletActionType.DOWN });
        return;
      }

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

      vegaWalletDispatch({
        type: VegaWalletActionType.INIT,
        keys,
        walletAssociatedBalance,
        vestingAssociatedBalance,
      });
    }

    run();
  }, [
    vegaWalletDispatch,
    appState.ethAddress,
    staking,
    vesting,
    vegaWalletService,
    vegaKeysLoaded,
  ]);

  if (!loaded) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children;
};
