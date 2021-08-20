import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RedemptionHome } from "./home";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleRedemption")}>
      <Web3Container>
        <TrancheContainer>
          <Switch>
            <Route exact path="/redemption">
              <RedemptionHome />
            </Route>
            <Route path="/redemption/:id">Test</Route>
          </Switch>
        </TrancheContainer>
      </Web3Container>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
