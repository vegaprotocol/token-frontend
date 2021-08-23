import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { VegaWallet } from "../../components/vega-wallet";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { Staking } from "./staking";
import { StakingNode } from "./staking-node";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  return (
    <TemplateSidebar
      title={t("pageTitleStaking")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Switch>
        <Route path={`${match.path}/:node`}>
          <StakingNode />
        </Route>
        <Route path={match.path} exact>
          <Staking />
        </Route>
      </Switch>
    </TemplateSidebar>
  );
};

export default RedemptionRouter;
