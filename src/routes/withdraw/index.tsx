import { Route, Switch, useRouteMatch } from "react-router";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { WithdrawIndex } from "./withdraw-index";
import { WithdrawPending } from "./withdraw-pending";

const WithdrawRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/pending`}>
        <WithdrawPending />
      </Route>
      <Route path={match.path} exact>
        <WithdrawIndex />
      </Route>
    </Switch>
  );
};

export default WithdrawRouter;
