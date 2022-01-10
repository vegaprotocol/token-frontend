import * as Sentry from "@sentry/react";
import { useWeb3React } from "@web3-react/core";
import React from "react";

import { SplashLoader } from "./components/splash-loader";
import { SplashScreen } from "./components/splash-screen";
import {
  AppStateActionType,
  useAppState,
} from "./contexts/app-state/app-state-context";
import { useContracts } from "./contexts/contracts/contracts-context";
import { useRefreshAssociatedBalances } from "./hooks/use-refresh-associated-balances";
import {
  Errors as VegaWalletServiceErrors,
  vegaWalletService,
} from "./lib/vega-wallet/vega-wallet-service";

export const AppLoader = ({ children }: { children: React.ReactElement }) => {
  const { account } = useWeb3React();
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
      // attempt to load keys complete
      setVegaKeysLoaded(true);

      if (
        keysErr === VegaWalletServiceErrors.SERVICE_UNAVAILABLE ||
        versionErr === VegaWalletServiceErrors.SERVICE_UNAVAILABLE
      ) {
        appDispatch({ type: AppStateActionType.VEGA_WALLET_DOWN });
        return;
      }

      // Any other error do nothing so user has to auth again, but our load for vega keys is complete
      if (keysErr) {
        return;
      }

      let key = undefined;
      if (account && keys && keys.length) {
        key = vegaWalletService.key || keys[0].pub;
        await setAssociatedBalances(account, key);
      }

      appDispatch({
        type: AppStateActionType.VEGA_WALLET_INIT,
        keys,
        key,
        version,
      });
    }

    run();
  }, [appDispatch, account, vegaKeysLoaded, setAssociatedBalances]);

  // Check if Vega network is restoring, if it is, start polling every 10 seconds
  // so the banner is removed once the network has caught up to the latest block
  React.useEffect(() => {
    let interval: any = null;

    const getNetworkLimits = async () => {
      const [networkLimits, stats] = await Promise.all([
        fetch("https://n04.d.vega.xyz/network/limits").then((res) =>
          res.json()
        ),
        fetch("https://n04.d.vega.xyz/statistics").then((res) => res.json()),
      ]);

      const restoreBlock = Number(
        networkLimits.networkLimits.bootstrapBlockCount
      );
      const currentBlock = Number(stats.statistics.blockHeight);

      if (currentBlock <= restoreBlock) {
        appDispatch({
          type: AppStateActionType.SET_BANNER_MESSAGE,
          message:
            "The network is less than 900 blocks old, it could be in the process of restoring from a checkpoint",
        });

        if (!interval) {
          startPoll();
        }
      } else {
        appDispatch({
          type: AppStateActionType.SET_BANNER_MESSAGE,
          message: "",
        });

        if (interval) {
          stopPoll();
        }
      }
    };

    const startPoll = () => {
      interval = setInterval(() => {
        getNetworkLimits();
      }, 10000);
    };

    const stopPoll = () => {
      clearInterval(interval);
      interval = null;
    };

    getNetworkLimits();

    return () => {
      stopPoll();
    };
  }, [appDispatch]);

  if (!loaded) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children;
};
