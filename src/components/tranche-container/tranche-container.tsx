import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

export const TrancheContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const vesting = useVegaVesting();
  const { appState, appDispatch } = useAppState();

  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: "SET_TRANCHES", tranches });
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

  return <>{children}</>;
};
