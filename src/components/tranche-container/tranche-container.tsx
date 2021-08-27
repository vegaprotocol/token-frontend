import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

const useGetUserTrancheBalances = (address: string) => {
  const vesting = useVegaVesting();
  const { appDispatch } = useAppState();
  return React.useCallback(async () => {
    const tranches = await vesting.getAllTranches();
    const userTranches = tranches.filter((t) =>
      t.users.some(
        ({ address: a }) => a.toLowerCase() === address.toLowerCase()
      )
    );
    const promises = userTranches.map(async (t) => {
      const [total, vested] = await Promise.all([
        vesting.userTrancheTotalBalance(address, t.tranche_id),
        vesting.userTrancheVestedBalance(address, t.tranche_id),
      ]);
      return {
        id: t.tranche_id,
        locked: total.minus(vested),
        vested,
      };
    });
    const trancheBalances = await Promise.all(promises);
    appDispatch({
      type: AppStateActionType.SET_TRANCHE_DATA,
      trancheBalances,
      tranches,
    });
  }, [address, appDispatch, vesting]);
};

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
