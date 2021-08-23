import React from "react";
import { Route, Switch } from "react-router-dom";
import { SplashLoader } from "../../components/splash-loader";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { RedemptionInformation } from "./home/redemption-information";
import { RedemptionError } from "./redemption-error";
import {
  initialRedemptionState,
  RedemptionActionType,
  redemptionReducer,
} from "./redemption-reducer";
import { RedeemFromTranche } from "./tranche";

const RedemptionRouter = ({
  address,
  tranches,
}: {
  address: string;
  tranches: Tranche[];
}) => {
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  React.useEffect(() => {
    const run = async () => {
      dispatch({
        type: RedemptionActionType.SET_LOADING,
        loading: true,
      });
      try {
        const userTranches = tranches.filter((t) =>
          t.users.some(
            ({ address: a }) => a.toLowerCase() === address.toLowerCase()
          )
        );
        dispatch({
          type: RedemptionActionType.SET_USER_TRANCHES,
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
          type: RedemptionActionType.SET_USER_BALANCES,
          balances,
          lien,
        });
      } catch (e) {
        dispatch({
          type: RedemptionActionType.ERROR,
          error: e,
        });
      } finally {
        dispatch({
          type: RedemptionActionType.SET_LOADING,
          loading: false,
        });
      }
    };
    run();
  }, [address, tranches, vesting]);

  if (state.loading) {
    return <SplashLoader />;
  }

  if (state.error) {
    return <RedemptionError />;
  }

  return (
    <Switch>
      <Route exact path="/redemption">
        <RedemptionInformation state={state} address={address} />
      </Route>
      <Route path="/redemption/:id">
        <RedeemFromTranche state={state} />
      </Route>
    </Switch>
  );
};

export default RedemptionRouter;
