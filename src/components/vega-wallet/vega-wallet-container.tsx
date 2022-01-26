import React from "react";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import { VegaWalletForm } from "./vega-wallet-form";

export const VegaWalletFormContainer = () => {
  const { appDispatch } = useAppState();
  // const [isVegaWalletRunning, setIsVegaWalletRunning] = React.useState(
  //   appState.vegaWalletStatus !== VegaWalletStatus.None
  // );
  const [url, setUrl] = React.useState("https://localhost:1789");

  // React.useEffect(() => {
  //   const run = async () => {
  //     if (!url) return;
  //     vegaWalletService.url = url;
  //     const [version] = await vegaWalletService.getVersion();
  //     setIsVegaWalletRunning(version !== Errors.SERVICE_UNAVAILABLE);
  //   };
  //   run(); // run it first so that the intial state is correct
  //   const interval = setInterval(run, 2000); // then pull every 2 seconds in case the wallet is started/stopped while the modal is up

  //   return () => clearInterval(interval);
  // }, [url]);

  return (
    <VegaWalletForm
      onConnect={() =>
        appDispatch({
          type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
          isOpen: false,
        })
      }
      url={url}
      setUrl={setUrl}
    />
  );
};
