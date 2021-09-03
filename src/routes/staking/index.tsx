import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { VegaWallet } from "../../components/vega-wallet";
import { Flags } from "../../flags";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { AssociateContainer } from "./associate/associate-page";
import { DisassociateContainer } from "./disassociate/disassociate-page";
import { Staking } from "./staking";
import { StakingNodeContainer } from "./staking-node";

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

  return Flags.MAINNET_DISABLED ? (
    <TemplateDefault title={title}>
      <div>{t("Staking is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
    </TemplateDefault>
  ) : (
    <TemplateSidebar title={title} sidebar={[<EthWallet />, <VegaWallet />]}>
      {Flags.MAINNET_DISABLED ? (
        <div>{t("Staking is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
      ) : (
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
            <Staking />
          </Route>
        </Switch>
      )}
    </TemplateSidebar>
  );
};

export default StakingRouter;
