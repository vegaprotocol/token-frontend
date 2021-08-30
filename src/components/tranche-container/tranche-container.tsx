import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useGetUserTrancheBalances } from "../../hooks/use-get-user-tranche-balances";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

export const TrancheContainer = ({
  address,
  children,
}: {
  address: string;
  children: (tranches: Tranche[]) => JSX.Element;
}) => {
  const { appState } = useAppState();
  const getUserTrancheBalances = useGetUserTrancheBalances(address);

  React.useEffect(() => {
    getUserTrancheBalances();
  }, [getUserTrancheBalances]);

  if (!appState.tranches) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children(appState.tranches);
};
