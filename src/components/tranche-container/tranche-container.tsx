import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

export const TrancheContainer = ({
  children,
}: {
  children: (tranches: Tranche[]) => JSX.Element;
}) => {
  const vesting = useVegaVesting();
  const { appState, appDispatch } = useAppState();

  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: AppStateActionType.SET_TRANCHES, tranches });
    };

    run();
  }, [appDispatch, vesting]);

  if (!appState.tranches) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children(appState.tranches);
};
