import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { Flags } from "../../config";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { LiquidityDeposit } from "./deposit";
import { LiquidityContainer } from "./liquidity-container";
import { LiquidityWithdraw } from "./withdraw";
import {Redirect} from "react-router";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const withdraw = useRouteMatch(`${match.path}/:address/withdraw`);
  const deposit = useRouteMatch(`${match.path}/:address/deposit`);

  const title = React.useMemo(() => {
    if (withdraw) {
      return t("pageTitleWithdrawLp");
    } else if (deposit) {
      return t("pageTitleDepositLp");
    }
    return t("pageTitleLiquidity");
  }, [withdraw, deposit, t]);
  return (
    <TemplateSidebar title={title} sidebar={[<EthWallet />]}>
      {Flags.DEX_STAKING_DISABLED ? (
        <p>{t("liquidityComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</p>
      ) : (
        <Switch>
          <Route exact path={`${match.path}`}>
            <LiquidityContainer />
          </Route>
          <Route path={`${match.path}/:address/deposit`}>
            <LiquidityDeposit />
          </Route>
          <Route path={`${match.path}/:address/withdraw`}>
            <LiquidityWithdraw />
          </Route>
          <Route path={`${match.path}/:address/`}>
            <Redirect to={match.path}/>
          </Route>
        </Switch>
      )}
    </TemplateSidebar>
  );
};

export default RedemptionIndex;
