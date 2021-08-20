import React from "react";
import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { Connect } from "../../components/connect";
import { DefaultTemplate } from "../../components/page-templates/default";
import { SplashLoader } from "../../components/splash-loader";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { RedemptionError } from "./redemption-error";
import { RedemptionInformation } from "./redemption-information";
import {
  initialRedemptionState,
  redemptionReducer,
} from "./redemption-reducer";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  const vesting = useVegaVesting();
  const {
    appState: { address, tranches },
  } = useAppState();
  useDocumentTitle(name);
  const { appState } = useAppState();
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(
    redemptionReducer,
    initialRedemptionState
  );
  React.useEffect(() => {
    const run = async () => {
      // Don't do anything until the user has connected
      if (address) {
        dispatch({
          type: "SET_LOADING",
          loading: true,
        });
        try {
          const userTranches =
            tranches?.filter((t) =>
              t.users.some(
                ({ address: a }) => a.toLowerCase() === address.toLowerCase()
              )
            ) || [];
          dispatch({
            type: "SET_USER_TRANCHES",
            userTranches,
          });
          const getLien = vesting.getLien(address);
          // TODO need to get the user staked balance here as well
          const promises = userTranches.map(async (t) => {
            const [locked, vested] = await Promise.all([
              vesting.userTrancheLockedBalance(address, t.tranche_id),
              vesting.userTrancheVestedBalance(address, t.tranche_id),
            ]);
            return {
              id: t.tranche_id,
              locked,
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
  let pageContent = null;
  if (state.loading) {
    pageContent = <SplashLoader />;
  } else if (state.error) {
    pageContent = <RedemptionError />;
  } else if (!appState.address) {
    pageContent = <Connect />;
  } else {
    pageContent = <RedemptionInformation state={state} />;
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
