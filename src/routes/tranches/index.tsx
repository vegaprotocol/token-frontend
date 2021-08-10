import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { TrancheContainer } from "../../components/tranche-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RouteChildProps } from "..";

const TrancheRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  console.log(match);

  return (
    <TrancheContainer>
      <DefaultTemplate title={t("pageTitleTranches")}>
        <Web3Container>
          <Switch>
            <Route path={match.path} exact>
              <Tranches />
            </Route>
            <Route path={`${match.path}/:trancheId`}>
              <Tranche />
            </Route>
          </Switch>
        </Web3Container>
      </DefaultTemplate>
    </TrancheContainer>
  );
};

export default TrancheRouter;
