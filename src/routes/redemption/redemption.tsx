import {
  RedemptionActionType,
  initialRedemptionState,
  redemptionReducer,
} from "./redemption-reducer";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import React from "react";
import { RedeemFromTranche } from "./tranche";
import { RedemptionInformation } from "./home/redemption-information";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { useTranches } from "../../hooks/use-tranches";
import { useTranslation } from "react-i18next";
import { useContracts } from "../../contexts/contracts/contracts-context";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

const RedemptionRouter = () => {
  const { t } = useTranslation();
  const match = useRouteMatch();
  const { vesting } = useContracts();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  const { ethAddress } = useWeb3();
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
