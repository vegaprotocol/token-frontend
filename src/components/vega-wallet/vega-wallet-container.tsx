import React from "react";
import { AppStateActionType, useAppState } from "../../contexts/app-state/app-state-context";
import { Errors, vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import { VegaWalletForm } from "./vega-wallet-form";
import { VegaWalletNotRunning } from "./vega-wallet-not-running";


export const VegaWalletFormContainer = () => {
  const { appDispatch } = useAppState();
  const [isVegaWalletRunning, setIsVegaWalletRunning] = React.useState(false);

  React.useEffect(() => {
    const run = async () => {
      const [version] = await vegaWalletService.getVersion();
      console.log("version", version);
      setIsVegaWalletRunning(version !== Errors.SERVICE_UNAVAILABLE);
    };
    run();
  }, []);

  return isVegaWalletRunning ? (
    <VegaWalletForm
      onConnect={() =>
        appDispatch({
          type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
          isOpen: false,
        })
      }
    />
  ) : (
    <VegaWalletNotRunning />
  );

}



