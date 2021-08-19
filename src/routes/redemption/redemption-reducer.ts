import { BigNumber } from "../../lib/bignumber";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";

export interface RedemptionState {
  error: Error | null;
  userTranches: Tranche[];
  loading: boolean;
  unlockedBalance: BigNumber;
  lockedBalance: BigNumber;
  stakedBalance: BigNumber;
}

export const initialRedemptionState: RedemptionState = {
  error: null,
  userTranches: [],
  loading: true,
  unlockedBalance: new BigNumber(0),
  lockedBalance: new BigNumber(0),
  stakedBalance: new BigNumber(0),
};

export type RedemptionAction =
  | {
      type: "ERROR";
      error: Error;
    }
  | {
      type: "SET_USER_TRANCHES";
      userTranches: Tranche[];
    }
  | {
      type: "SET_LOADING";
      loading: boolean;
    };

export function redemptionReducer(
  state: RedemptionState,
  action: RedemptionAction
) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "SET_USER_TRANCHES":
      return {
        ...state,
        userTranches: action.userTranches,
      };
    case "ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
