import BigNumber from "bignumber.js";
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
  children: (decimals: number, supply: BigNumber) => JSX.Element;
}) => {
  const { appState, appDispatch } = useAppState();
  const vegaToken = useVegaToken();

  React.useEffect(() => {
    const run = async () => {
      const supply = await vegaToken.getTotalSupply();
      const decimals = await vegaToken.getDecimals();

      appDispatch({
        type: AppStateActionType.SET_TOKEN,
        decimals,
        totalSupply: supply,
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

  return children(appState.decimals, appState.totalSupply);
};
