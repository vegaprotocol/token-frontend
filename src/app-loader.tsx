import * as Sentry from "@sentry/react";
import { useWeb3React } from "@web3-react/core";
import React from "react";

import { SplashError } from "./components/splash-error";
import { SplashLoader } from "./components/splash-loader";
import { SplashScreen } from "./components/splash-screen";
import { Flags } from "./config";
import {
  AppStateActionType,
  useAppState,
} from "./contexts/app-state/app-state-context";
import { useContracts } from "./contexts/contracts/contracts-context";
import { useRefreshAssociatedBalances } from "./hooks/use-refresh-associated-balances";
import { vegaWalletService } from "./lib/vega-wallet/vega-wallet-service";

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

    if (!Flags.NETWORK_DOWN) {
      run();
    }
  }, [token, appDispatch, staking, vesting]);

  // Attempt to get vega keys on startup
  React.useEffect(() => {
    async function run() {
      try {
        const keysRes = await vegaWalletService.keysGet();
        const versionRes = await vegaWalletService.versionGet();

        let key = undefined;
        if (account && keysRes.keys && keysRes.keys.length) {
          key = keysRes.keys[0].pub;
          await setAssociatedBalances(account, key as string);
        }

        appDispatch({
          type: AppStateActionType.VEGA_WALLET_INIT,
          // @ts-ignore
          keys: keysRes.keys,
          key,
          version: versionRes.version,
        });
      } catch (err) {
        // @ts-ignore
        console.log("failed", err.message);
        // @ts-ignore
        if (err.message === "Failed to fetch") {
          appDispatch({ type: AppStateActionType.VEGA_WALLET_DOWN });
        } else {
          appDispatch({ type: AppStateActionType.VEGA_WALLET_UP });
        }
      } finally {
        setVegaKeysLoaded(true);
      }
    }

    if (!Flags.NETWORK_DOWN) {
      run();
    }
  }, [appDispatch, account, vegaKeysLoaded, setAssociatedBalances]);

  if (Flags.NETWORK_DOWN) {
    return (
      <SplashScreen>
        <SplashError />
      </SplashScreen>
    );
  }

  if (!loaded) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children;
};
