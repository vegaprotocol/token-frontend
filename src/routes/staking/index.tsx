import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { Staking } from "./staking";
import { StakingNode } from "./staking-node";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  return (
    <DefaultTemplate title={t("pageTitleStaking")}>
      <Switch>
        <Route path={`${match.path}/:node`}>
          <StakingNode />
        </Route>
        <Route path={match.path} exact>
          <Staking />
        </Route>
      </Switch>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
