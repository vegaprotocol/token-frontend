import { merge } from "lodash";
import { BigNumber } from "../../lib/bignumber";

export interface LpContractData {
  rewardPerEpoch: BigNumber;
  rewardPoolBalance: BigNumber;
  awardContractAddress: string;
  estimateAPY: BigNumber;
  availableLPTokens: BigNumber | null;
  stakedLPTokens: BigNumber | null;
  shareOfPool: BigNumber | null;
  accumulatedRewards: BigNumber | null;
  pendingStakedLPTokens: BigNumber | null;
}

export interface LiquidityState {
  contractData: {
    [key: string]: LpContractData;
  };
}

export const initialLiquidityState: LiquidityState = {
  contractData: {},
};

export enum LiquidityActionType {
  SET_CONTRACT_INFORMATION,
}

export type LiquidityAction = {
  type: LiquidityActionType.SET_CONTRACT_INFORMATION;
  contractData: Partial<LpContractData>;
  contractAddress: string;
};

export function liquidityReducer(
  state: LiquidityState,
  action: LiquidityAction
): LiquidityState {
  switch (action.type) {
    case LiquidityActionType.SET_CONTRACT_INFORMATION:
      return {
        ...state,
        contractData: merge({}, state.contractData, {
          [action.contractAddress]: action.contractData,
        }),
      };
  }
}
