import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { TrancheContainer } from "../../components/tranche-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RouteChildProps } from "..";

const TrancheRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();

  return (
    <TemplateDefault title={t("pageTitleTranches")}>
      <Web3Container>
        {(address) => (
          <TrancheContainer>
            {(tranches) => (
              <Switch>
                <Route path={match.path} exact>
                  <Tranches tranches={tranches} />
                </Route>
                <Route path={`${match.path}/:trancheId`}>
                  <Tranche tranches={tranches} />
                </Route>
              </Switch>
            )}
          </TrancheContainer>
        )}
      </Web3Container>
    </TemplateDefault>
  );
};

export default TrancheRouter;
