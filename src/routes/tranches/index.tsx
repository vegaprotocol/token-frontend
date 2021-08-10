import { Route, Switch } from "react-router-dom";
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

  return (
    <TrancheContainer>
      <DefaultTemplate title={t("pageTitleTranches")}>
        <Web3Container>
          <Switch>
            <Route path="/tranches" exact>
              <Tranches />
            </Route>
            <Route path="/tranches/:trancheId">
              <Tranche />
            </Route>
          </Switch>
        </Web3Container>
      </DefaultTemplate>
    </TrancheContainer>
  );
};

export default TrancheRouter;
