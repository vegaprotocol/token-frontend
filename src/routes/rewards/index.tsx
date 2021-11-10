import { Route, Switch, useRouteMatch } from "react-router";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RewardsIndex } from "./home";
import { Withdraw } from "./withdraw";

const RewardRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={match.path} exact>
        <RewardsIndex />
      </Route>
      <Route path={`${match.path}/withdraw`}>
        <Withdraw />
      </Route>
    </Switch>
  );
};

export default RewardRouter;
