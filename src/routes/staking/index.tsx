import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { Heading } from "../../components/heading";
import { Flags } from "../../config";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { AssociateContainer } from "./associate/associate-page-container";
import { DisassociateContainer } from "./disassociate/disassociate-page-container";
import { Staking } from "./staking";
import { StakingNodeContainer } from "./staking-node";
import { StakingNodesContainer } from "./staking-nodes-container";

const StakingRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const associate = useRouteMatch(`${match.path}/associate`);
  const disassociate = useRouteMatch(`${match.path}/disassociate`);

  const title = React.useMemo(() => {
    if (associate) {
      return t("pageTitleAssociate");
    } else if (disassociate) {
      return t("pageTitleDisassociate");
    }
    return t("pageTitleStaking");
  }, [associate, disassociate, t]);

  return Flags.STAKING_DISABLED ? (
    <>
      <Heading title={title} />
      <div>{t("Staking is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
    </>
  ) : (
    <>
      <Heading title={title} />
      <Switch>
        <Route path={`${match.path}/associate`}>
          <AssociateContainer />
        </Route>
        <Route path={`${match.path}/disassociate`}>
          <DisassociateContainer />
        </Route>
        <Route path={`${match.path}/:node`}>
          <StakingNodeContainer />
        </Route>
        <Route path={match.path} exact>
          <StakingNodesContainer>
            {({ data }) => <Staking data={data} />}
          </StakingNodesContainer>
        </Route>
      </Switch>
    </>
  );
};

export default StakingRouter;
