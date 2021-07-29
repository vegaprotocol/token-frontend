import React from "react";
import { Route, Switch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";

const TrancheRouter = () => {
  const { t } = useTranslation();
  const {
    appState: { tranches },
  } = useAppState();
  return (
    <DefaultTemplate title={t("pageTitleTranches")}>
      <Switch>
        <Route path="/tranches" exact>
          <Tranches tranches={tranches} />
        </Route>
        <Route path="/tranches/:trancheId">
          <Tranche tranches={tranches} />
        </Route>
      </Switch>
    </DefaultTemplate>
  );
};

export default TrancheRouter;
