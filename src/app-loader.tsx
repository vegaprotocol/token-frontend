import React from "react";
import * as Sentry from "@sentry/react";
import { SplashLoader } from "./components/splash-loader";
import { SplashScreen } from "./components/splash-screen";
import {
  AppStateActionType,
  useAppState,
} from "./contexts/app-state/app-state-context";
import {
  Errors as VegaWalletServiceErrors,
  vegaWalletService,
} from "./lib/vega-wallet/vega-wallet-service";
import { useContracts } from "./contexts/contracts/contracts-context";
import { useRefreshAssociatedBalances } from "./hooks/use-refresh-associated-balances";
import { useWeb3 } from "./contexts/web3-context/web3-context";

export const AppLoader = ({ children }: { children: React.ReactElement }) => {
  const { ethAddress } = useWeb3();
  const { appDispatch } = useAppState();
  const { token, staking, vesting } = useContracts();
  const setAssociatedBalances = useRefreshAssociatedBalances();
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
      const [keysErr, keys] = await vegaWalletService.getKeys();
      const [versionErr, version] = await vegaWalletService.getVersion();
      if (version) {
      }
      // attempt to load keys complete
      setVegaKeysLoaded(true);

      if (keysErr === VegaWalletServiceErrors.NO_TOKEN) {
        // Do nothing so user has to auth again, but our load for vega keys is complete
        return;
      }

      if (
        keysErr === VegaWalletServiceErrors.SERVICE_UNAVAILABLE ||
        versionErr === VegaWalletServiceErrors.SERVICE_UNAVAILABLE
      ) {
        appDispatch({ type: AppStateActionType.VEGA_WALLET_DOWN });
        return;
      }

      if (ethAddress && keys && keys.length) {
        await setAssociatedBalances(ethAddress, keys[0].pub);
      }

      appDispatch({
        type: AppStateActionType.VEGA_WALLET_INIT,
        keys,
        version,
      });
    }

    run();
  }, [appDispatch, ethAddress, vegaKeysLoaded, setAssociatedBalances]);

  if (!loaded) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children;
};
