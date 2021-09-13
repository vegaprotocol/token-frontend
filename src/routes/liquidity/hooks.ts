import React from "react";
import { REWARDS_ADDRESSES } from "../../config";
import { BigNumber } from "../../lib/bignumber";
import { LiquidityAction, LiquidityActionType } from "./liquidity-reducer";
import { IVegaLPStaking } from "../../lib/web3-utils";
import * as Sentry from "@sentry/react";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";

export const useGetLiquidityBalances = (
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
