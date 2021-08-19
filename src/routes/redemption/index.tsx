import React from "react";
import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { Connect } from "../../components/connect";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RedemptionInformation } from "./redemption-information";
import {
  initialRedemptionState,
  redemptionReducer,
} from "./redemption-reducer";

const RedemptionRouter = ({ name }: RouteChildProps) => {
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
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    try {
      const unlockedBalance = 0.0005;
      const lockedBalance = 0.0005;
      const stakedBalance = 0.0005;
      const userTranches =
        tranches?.filter((t) =>
          t.users.some(({ address: a }) => a === address)
        ) || [];
      dispatch({
        type: "SET_USER_TRANCHES",
        userTranches,
      });
    } catch (e) {
      dispatch({
        type: "ERROR",
        error: e,
      });
    } finally {
      dispatch({
        type: "SET_LOADING",
        loading: true,
      });
    }
  }, [address, tranches]);
  let pageContent = null;
  if (state.error) {
    throw new Error("Implement this dexter you dumbass");
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
