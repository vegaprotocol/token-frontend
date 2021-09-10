import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Callout } from "../../components/callout";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useTranches } from "../../hooks/use-tranches";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { RedemptionInformation } from "./home/redemption-information";
import {
  initialRedemptionState,
  RedemptionActionType,
  redemptionReducer,
} from "./redemption-reducer";
import { RedeemFromTranche } from "./tranche";

const RedemptionRouter = () => {
  const { t } = useTranslation();
  const match = useRouteMatch();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  const {
    appState: { trancheBalances },
  } = useAppState();
  const { ethAddress } = useEthUser();
  const tranches = useTranches();

  React.useEffect(() => {
    const run = (address: string) => {
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

    if (ethAddress) {
      run(ethAddress);
    }
  }, [ethAddress, tranches, vesting]);

  if (!tranches.length) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  if (!trancheBalances.length) {
    return (
      <Callout>
        <p>{t("You have no VEGA tokens currently vesting.")}</p>
      </Callout>
    );
  }

  if (!ethAddress) {
    return (
      <EthConnectPrompt>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
      </EthConnectPrompt>
    );
  }

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <RedemptionInformation state={state} address={ethAddress} />
      </Route>
      <Route path={`${match.path}/:id`}>
        <RedeemFromTranche state={state} address={ethAddress} />
      </Route>
    </Switch>
  );
};

export default RedemptionRouter;
