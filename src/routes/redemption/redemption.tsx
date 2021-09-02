import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { EthWrongChainPrompt } from "../../components/eth-connect-prompt/eth-wrong-chain-prompt";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { RedemptionInformation } from "./home/redemption-information";
import {
  initialRedemptionState,
  RedemptionActionType,
  redemptionReducer,
} from "./redemption-reducer";
import { RedeemFromTranche } from "./tranche";

const RedemptionRouter = () => {
  const { appState } = useAppState();
  const match = useRouteMatch();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  const { address } = useEthUser();

  React.useEffect(() => {
    const run = async (address: string) => {
      const tranches = await vesting.getAllTranches();
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

    if (address) {
      run(address);
    }
  }, [address, vesting]);

  if (appState.appChainId !== appState.chainId) {
    return <EthWrongChainPrompt />;
  }

  if (!address) {
    return <EthConnectPrompt />;
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
