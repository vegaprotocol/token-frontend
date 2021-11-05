import { Route, Switch, useRouteMatch } from "react-router";
import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RewardsIndex } from "./home";
import { Heading } from "../../components/heading";

const RewardRouter = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);
  const match = useRouteMatch();

  return (
    <>
      <Heading title={t("pageTitleRewards")} />
      <Switch>
        <Route path={match.path} exact>
          <RewardsIndex />
        </Route>
        <Route path={`${match.path}/withdraw`}></Route>
      </Switch>
    </>
  );
};

export default RewardRouter;
