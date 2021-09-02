import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RewardsIndex } from "./home";

const RewardRouter = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);
  const match = useRouteMatch();

  return (
    <TemplateDefault title={t("pageTitleRewards")}>
      <Switch>
        <Route path={match.path} exact>
          <RewardsIndex />
        </Route>
        <Route path={`${match.path}/withdraw`}></Route>
      </Switch>
    </TemplateDefault>
  );
};

export default RewardRouter;
