import { BigNumber } from "../../lib/bignumber";
import {ADDRESSES } from "../../config";

export type DexLpStakingContractLoading = {
  // The ethereum address of the contract
  address: string
  // A title we can use to refer to the contract (a pair maybe?)
  title: string
}
/**
 * What I imagine we need to know about a contract to render this
 */
export type DexLPStakingContract = {
  // The ethereum address of the contract
  address: string
  // A title we can use to refer to the contract (a pair maybe?)
  title: string
  // The total reward that has been deposited for distribution
  availableRewardBalance: BigNumber,
  // The token that this contract deals with
  acceptsToken: string,
  // The earned reward balance that the connected wallet has earned
  connectedUserRewardBalance: BigNumber
  // The balance of acceptsToken that the user has in this contract
  connectedUserBalance: BigNumber,
  estimatedAPY: number
}

export interface DexContractState {
  "sushi-vega-eth": DexLpStakingContractLoading | DexLPStakingContract ,
  "sushi-vega-usdc": DexLpStakingContractLoading | DexLPStakingContract,
  "uni-vega-eth": DexLpStakingContractLoading | DexLPStakingContract,
  "uni-vega-usdc": DexLpStakingContractLoading | DexLPStakingContract
}

export const initialDexContractsState: DexContractState = ADDRESSES.dexLiquidityRewards;

export enum DexLiquidityActionType {
  UPDATE_CONTRACT_STATE,
}

export type DexLiquidityAction = {
  type: DexLiquidityActionType.UPDATE_CONTRACT_STATE;
  update: Partial<DexContractState>;
};

export function dexLiquidityReducer(
  state: DexContractState,
  action: DexLiquidityAction
): DexContractState {
  switch (action.type) {
    case DexLiquidityActionType.UPDATE_CONTRACT_STATE:
      return {
        ...state,
        ...action.update
      };
  }

  return initialDexContractsState
}
