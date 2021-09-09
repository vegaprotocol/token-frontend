import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { Flags } from "../../flags";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { LiquidityDeposit } from "./deposit";
import { LiquidityContainer } from "./liquidity-container";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();

  return (
    <TemplateDefault title={t("pageTitleLiquidity")}>
      {Flags.DEX_STAKING_DISABLED ? (
        <p>{t("liquidityComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</p>
      ) : (
        <Switch>
          <Route exact path={`${match.path}`}>
            <LiquidityContainer />
          </Route>
          <Route path={`${match.path}/:address`}>
            <LiquidityDeposit />
          </Route>
        </Switch>
      )}
    </TemplateDefault>
  );
};

export default RedemptionIndex;
