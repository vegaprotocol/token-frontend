import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Tranche as TrancheType } from "../../lib/vega-web3/vega-web3-types";
import { RedemptionInformation } from "./home/redemption-information";
import {
  initialRedemptionState,
  RedemptionActionType,
  redemptionReducer,
} from "./redemption-reducer";
import { RedeemFromTranche } from "./tranche";
import { Tranche } from "./tranches/tranche";
import { Tranches } from "./tranches/tranches";

const RedemptionRouter = ({
  address,
  tranches,
}: {
  address: string;
  tranches: TrancheType[];
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

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <RedemptionInformation state={state} address={address} />
      </Route>
      <Route path={`${match.path}/tranches`} exact>
        <Tranches tranches={tranches} />
      </Route>
      <Route path={`${match.path}/tranches/:trancheId`}>
        <Tranche tranches={tranches} />
      </Route>
      <Route path={`${match.path}/:id`}>
        <RedeemFromTranche state={state} address={address} />
      </Route>
    </Switch>
  );
};

export default RedemptionRouter;
