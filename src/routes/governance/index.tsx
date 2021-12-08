import "./governance.scss";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
// import { Route, Switch, useRouteMatch } from "react-router-dom";
// import { ProposalsContainer } from "./proposals-container";
// import { ProposalContainer } from "./proposal-container";

const GovernanceRouter = ({ name }: RouteChildProps) => {
  // const match = useRouteMatch();
  useDocumentTitle(name);
  throw new Error("Test");
  // return (
  //   <Switch>
  //     <Route path={match.path} exact>
  //       <ProposalsContainer />
  //     </Route>
  //     <Route path={`${match.path}/:proposalId`}>
  //       <ProposalContainer />
  //     </Route>
  //   </Switch>
  // );
};

export default GovernanceRouter;
