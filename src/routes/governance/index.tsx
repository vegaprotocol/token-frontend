import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Flags } from "../../config";
import { Heading } from "../../components/heading";
import { ProposalsContainer } from "./proposals-container";
import { ProposalContainer } from "./proposal-container";

const GovernanceRouter = ({ name }: RouteChildProps) => {
  const match = useRouteMatch();
  useDocumentTitle(name);
  const { t } = useTranslation();

  if (Flags.GOVERNANCE_DISABLED) {
    return (
      <>
        <Heading title={t("pageTitleGovernance")} />
        <section>{t("Governance is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</section>
      </>
    );
  }

  return (
    <Switch>
      <Route path={match.path} exact>
        <ProposalsContainer />
      </Route>
      <Route path={`${match.path}/:proposalId`}>
        <ProposalContainer />
      </Route>
    </Switch>
  );
};

export default GovernanceRouter;
