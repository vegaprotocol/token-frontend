import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import { RouteChildProps } from "..";
import { Connect } from "../../components/connect";
import { DefaultTemplate } from "../../components/page-templates/default";
import { SplashLoader } from "../../components/splash-loader";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Home } from "./home";
import { RedemptionError } from "./redemption-error";
import {
  redemptionReducer,
  initialRedemptionState,
} from "./redemption-reducer";
import { RedeemFromTranche } from "./tranche";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  const vesting = useVegaVesting();
  const {
    appState: { address, tranches },
  } = useAppState();

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
          const filterUserTranches = userTranches.filter(
            ({ total_added, total_removed }) =>
              !total_added.isEqualTo(total_removed)
          );
          dispatch({
            type: "SET_USER_TRANCHES",
            userTranches: filterUserTranches,
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
  }, [address, dispatch, tranches, vesting]);

  let pageContent;
  if (state.loading) {
    pageContent = <SplashLoader />;
  } else if (state.error) {
    pageContent = <RedemptionError />;
  } else if (!address) {
    pageContent = <Connect />;
  } else if (address) {
    pageContent = (
      <Switch>
        <Route exact path="/redemption">
          <Home state={state} />
        </Route>
        <Route path="/redemption/:id">
          <RedeemFromTranche state={state} />
        </Route>
      </Switch>
    );
  }
  return (
    <DefaultTemplate title={t("pageTitleRedemption")}>
      <Web3Container>
        <TrancheContainer>{pageContent}</TrancheContainer>
      </Web3Container>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
