import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useVegaToken } from "../../hooks/use-vega-token";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

export const VegaTokenContainer = ({
  children,
}: {
  children: (data: { decimals: number; totalSupply: string }) => JSX.Element;
}) => {
  const { appState } = useAppState();

  React.useEffect(() => {
    const run = async () => {
      const { totalSupply, decimals } = await vegaToken.tokenData();

      appDispatch({
        type: AppStateActionType.SET_TOKEN,
        decimals,
        totalSupply: totalSupply.toString(),
      });
    };

    run();
  }, [vegaToken, appDispatch]);

  if (!appState.totalSupply || !appState.decimals) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children({
    decimals: appState.decimals,
    totalSupply: appState.totalSupply,
  });
};
