import React from "react";
import { Connect } from "../../../components/connect";
import { SplashLoader } from "../../../components/splash-loader";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { RedemptionError } from "./redemption-error";
import { RedemptionInformation } from "./redemption-information";
import {
  redemptionReducer,
  initialRedemptionState,
} from "./redemption-reducer";

export const Home = () => {
  const vesting = useVegaVesting();
  const {
    appState: { address, tranches },
  } = useAppState();
  const { appState } = useAppState();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  React.useEffect(() => {
    const run = async () => {
      // Don't do anything until the user has connected
      if (address && tranches) {
        dispatch({
          type: "SET_LOADING",
          loading: true,
        });
        try {
          const userTranches = tranches.filter((t) =>
            t.users.some(
              ({ address: a }) => a.toLowerCase() === address.toLowerCase()
            )
          );
          dispatch({
            type: "SET_USER_TRANCHES",
            userTranches,
          });
          const getLien = vesting.getLien(address);
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
          const balances = await Promise.all(promises);
          const lien = await getLien;
          dispatch({
            type: "SET_USER_BALANCES",
            balances,
            lien,
          });
        } catch (e) {
          dispatch({
            type: "ERROR",
            error: e,
          });
        } finally {
          dispatch({
            type: "SET_LOADING",
            loading: false,
          });
        }
      }
    };
    run();
  }, [address, tranches, vesting]);
  if (state.loading) {
    return <SplashLoader />;
  } else if (state.error) {
    return <RedemptionError />;
  } else if (!appState.address) {
    return <Connect />;
  }
  return <RedemptionInformation state={state} />;
};
