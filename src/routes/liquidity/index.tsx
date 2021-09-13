import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { Flags, REWARDS_ADDRESSES } from "../../config";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { LiquidityDeposit } from "./deposit";
import { LiquidityContainer } from "./liquidity-container";
import { LiquidityWithdraw } from "./withdraw";
import { Redirect } from "react-router";
import { BigNumber } from "../../lib/bignumber";
import {
  initialLiquidityState,
  LiquidityAction,
  LiquidityActionType,
  liquidityReducer,
} from "./liquidity-reducer";
import { IVegaLPStaking } from "../../lib/web3-utils";
import * as Sentry from "@sentry/react";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";

const useGetLiquidityBalances = (
  dispatch: React.Dispatch<LiquidityAction>,
  ethAddress: string
) => {
  const lpStakingEth = useVegaLPStaking({
    address: REWARDS_ADDRESSES["Sushi Swap VEGA/ETH"],
  });
  const lpStakingUSDC = useVegaLPStaking({
    address: REWARDS_ADDRESSES["Sushi Swap VEGA/USDC"],
  });
  const getBalances = React.useCallback(
    async (lpStaking: IVegaLPStaking, contractAddress: string) => {
      try {
        const [
          rewardPerEpoch,
          rewardPoolBalance,
          estimateAPY,
          awardContractAddress,
        ] = await Promise.all<BigNumber, BigNumber, BigNumber, string>([
          await lpStaking.rewardPerEpoch(),
          await lpStaking.liquidityTokensInRewardPool(),
          await lpStaking.estimateAPY(),
          await lpStaking.awardContractAddress(),
        ]);
        let availableLPTokens = null;
        let stakedLPTokens = null;
        let accumulatedRewards = null;
        let shareOfPool = null;
        if (ethAddress) {
          const [unstaked, staked, rewards] = await Promise.all([
            lpStaking.totalUnstaked(ethAddress),
            lpStaking.stakedBalance(ethAddress),
            lpStaking.rewardsBalance(ethAddress),
          ]);
          availableLPTokens = unstaked;
          stakedLPTokens = staked;
          accumulatedRewards = rewards;

          // TODO: This is wrong, so the row showing it is hidden
          shareOfPool =
            stakedLPTokens.dividedBy(rewardPoolBalance).times(100).toString() +
            "%";
        }

        dispatch({
          type: LiquidityActionType.SET_CONTRACT_INFORMATION,
          contractAddress,
          contractData: {
            rewardPerEpoch: rewardPerEpoch,
            rewardPoolBalance: rewardPoolBalance,
            estimateAPY: estimateAPY,
            awardContractAddress: awardContractAddress,
            availableLPTokens,
            stakedLPTokens,
            shareOfPool,
            accumulatedRewards,
          },
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    [dispatch, ethAddress]
  );
  return {
    getBalances,
    lpStakingEth,
    lpStakingUSDC,
  };
};

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
  const { ethAddress } = useEthUser();
  const [loading, setLoading] = React.useState(true);
  const { getBalances, lpStakingUSDC, lpStakingEth } = useGetLiquidityBalances(
    dispatch,
    ethAddress
  );
  React.useEffect(() => {
    const run = async () => {
      try {
        await Promise.all([
          getBalances(lpStakingUSDC, REWARDS_ADDRESSES["Sushi Swap VEGA/USDC"]),
          getBalances(lpStakingEth, REWARDS_ADDRESSES["Sushi Swap VEGA/ETH"]),
        ]);
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [getBalances, lpStakingEth, lpStakingUSDC, ethAddress]);

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
    <TemplateSidebar title={title} sidebar={[<EthWallet />]}>
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
            <LiquidityWithdraw />
          </Route>
          <Route path={`${match.path}/:address/`}>
            <Redirect to={match.path} />
          </Route>
        </Switch>
      )}
    </TemplateSidebar>
  );
};

export default RedemptionIndex;
