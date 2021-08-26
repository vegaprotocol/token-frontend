import React from "react";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
  VegaWalletStatus,
} from "../../contexts/app-state/app-state-context";
import { useVegaStaking } from "../../hooks/use-vega-staking";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { Callout } from "../callout";
import { Error } from "../icons";

interface VegaWalletContainerProps {
  children: (data: { vegaKey: VegaKeyExtended }) => JSX.Element;
}

export const VegaWalletContainer = ({ children }: VegaWalletContainerProps) => {
  const { t } = useTranslation();
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

  if (appState.vegaWalletStatus === VegaWalletStatus.Pending) {
    return (
      <Callout intent="warn" title="">
        <p>{t("Checking Vega wallet status")}...</p>
      </Callout>
    );
  }

  if (appState.vegaWalletStatus === VegaWalletStatus.None) {
    return (
      <Callout intent="error" icon={<Error />}>
        <p>{t("noService")}</p>
      </Callout>
    );
  }

  if (!appState.currVegaKey) {
    return (
      <Callout intent="error" icon={<Error />}>
        <p>{t("connectVegaWallet")}</p>
      </Callout>
    );
  }

  return children({ vegaKey: appState.currVegaKey });
};
