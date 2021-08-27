import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { TrancheContainer } from "../../components/tranche-container";
import { VegaWallet } from "../../components/vega-wallet";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { AssociatePage } from "./associate/associate-page";
import { DisassociatePage } from "./disassociate/disassociate-page";
import { Staking } from "./staking";
import { StakingNode } from "./staking-node";

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
  return (
    <TemplateSidebar title={title} sidebar={[<EthWallet />, <VegaWallet />]}>
      <Web3Container>
        {(address) => (
          <VegaWalletContainer>
            {({ vegaKey }) => (
              <TrancheContainer address={address}>
                {() => (
                  <Switch>
                    <Route path={`${match.path}/associate`}>
                      <AssociatePage vegaKey={vegaKey} address={address} />
                    </Route>
                    <Route path={`${match.path}/disassociate`}>
                      <DisassociatePage vegaKey={vegaKey} address={address} />
                    </Route>
                    <Route path={`${match.path}/:node`}>
                      <StakingNode vegaKey={vegaKey} />
                    </Route>
                    <Route path={match.path} exact>
                      <Staking />
                    </Route>
                  </Switch>
                )}
              </TrancheContainer>
            )}
          </VegaWalletContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default StakingRouter;
