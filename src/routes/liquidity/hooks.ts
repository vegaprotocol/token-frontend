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
          await lpStaking.totalStaked(),
          await lpStaking.estimateAPY(),
          await lpStaking.awardContractAddress(),
        ]);
        let connectedWalletData = null;
        if (ethAddress) {
          const [unstaked, staked, rewards] = await Promise.all([
            lpStaking.totalUnstaked(ethAddress),
            lpStaking.stakedBalance(ethAddress),
            lpStaking.rewardsBalance(ethAddress),
          ]);
          const availableLPTokens = unstaked;
          const stakedLPTokens = staked;
          const accumulatedRewards = rewards;
          const shareOfPool = rewardPoolBalance.isEqualTo(0)
            ? rewardPoolBalance
            : stakedLPTokens.earningRewards
                .dividedBy(rewardPoolBalance)
                .times(100);

          connectedWalletData = {
            availableLPTokens,
            totalStaked: stakedLPTokens?.total,
            stakedLPTokens: stakedLPTokens?.earningRewards,
            pendingStakedLPTokens: stakedLPTokens?.pending,
            shareOfPool,
            accumulatedRewards,
          };
        }

        dispatch({
          type: LiquidityActionType.SET_CONTRACT_INFORMATION,
          contractAddress,
          contractData: {
            rewardPerEpoch,
            rewardPoolBalance,
            estimateAPY,
            awardContractAddress,
            connectedWalletData,
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
