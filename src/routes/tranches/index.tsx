import React from "react";
import { Route, Switch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useTranslation } from "react-i18next";

const TrancheRouter = () => {
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleTranches")}>
      <Switch>
        <Route path="/tranches" exact>
          <Tranches />
        </Route>
        <Route path="/tranches/:trancheId">
          <Tranche />
        </Route>
      </Switch>
    </DefaultTemplate>
  );
};

export default TrancheRouter;
