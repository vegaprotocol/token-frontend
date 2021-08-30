import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
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
  const match = useRouteMatch();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  React.useEffect(() => {
    const run = async () => {
      const userTranches = tranches.filter((t) =>
        t.users.some(
          ({ address: a }) => a.toLowerCase() === address.toLowerCase()
        )
      );
      dispatch({
        type: RedemptionActionType.SET_USER_TRANCHES,
        userTranches,
      });
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
      <Route exact path={`${match.path}`}>
        <RedemptionInformation state={state} address={address} />
      </Route>
      <Route path={`${match.path}/:id`}>
        <RedeemFromTranche state={state} address={address} />
      </Route>
    </Switch>
  );
};

export default RedemptionRouter;
