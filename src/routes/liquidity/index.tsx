import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { Flags, REWARDS_ADDRESSES } from "../../config";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { LiquidityDeposit } from "./deposit";
import { LiquidityContainer } from "./liquidity-container";
import { LiquidityWithdraw } from "./withdraw";
import { Redirect } from "react-router";
import { initialLiquidityState, liquidityReducer } from "./liquidity-reducer";
import * as Sentry from "@sentry/react";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { useGetLiquidityBalances } from "./hooks";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { Heading } from "../../components/heading";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const withdraw = useRouteMatch(`${match.path}/:address/withdraw`);
  const deposit = useRouteMatch(`${match.path}/:address/deposit`);
  const [state, dispatch] = React.useReducer(
    liquidityReducer,
    initialLiquidityState
  );
  const { ethAddress } = useWeb3();
  const [loading, setLoading] = React.useState(true);
  const { getBalances, lpStakingUSDC, lpStakingEth } = useGetLiquidityBalances(
    dispatch,
    ethAddress
  );
  const loadAllBalances = React.useCallback(async () => {
    try {
      await Promise.all([
        getBalances(lpStakingUSDC, REWARDS_ADDRESSES["SushiSwap VEGA/USDC"]),
        getBalances(lpStakingEth, REWARDS_ADDRESSES["SushiSwap VEGA/ETH"]),
      ]);
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [getBalances, lpStakingEth, lpStakingUSDC]);
  React.useEffect(() => {
    loadAllBalances();
  }, [loadAllBalances]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      loadAllBalances();
    }, 10000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  const title = React.useMemo(() => {
    if (withdraw) {
      return t("pageTitleWithdrawLp");
    } else if (deposit) {
      return t("pageTitleDepositLp");
    }
    return t("pageTitleLiquidity");
  }, [withdraw, deposit, t]);
  if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }
  return (
    <>
      <Heading title={title} />
      {Flags.DEX_STAKING_DISABLED ? (
        <p>{t("liquidityComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</p>
      ) : (
        <Switch>
          <Route exact path={`${match.path}`}>
            <LiquidityContainer state={state} dispatch={dispatch} />
          </Route>
          <Route path={`${match.path}/:address/deposit`}>
            <LiquidityDeposit state={state} dispatch={dispatch} />
          </Route>
          <Route path={`${match.path}/:address/withdraw`}>
            <LiquidityWithdraw state={state} dispatch={dispatch} />
          </Route>
          <Route path={`${match.path}/:address/`}>
            <Redirect to={match.path} />
          </Route>
        </Switch>
      )}
    </>
  );
};

export default RedemptionIndex;
