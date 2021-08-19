import { BigNumber } from "../../lib/bignumber";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";

export interface TrancheBalance {
  id: number;
  locked: BigNumber;
  vested: BigNumber;
}

export interface RedemptionState {
  error: Error | null;
  userTranches: Tranche[];
  loading: boolean;
  totalVestedBalance: BigNumber;
  totalLockedBalance: BigNumber;
  stakedBalance: BigNumber;
  balances: TrancheBalance[];
}

export const initialRedemptionState: RedemptionState = {
  error: null,
  userTranches: [],
  loading: false,
  totalVestedBalance: new BigNumber(0),
  totalLockedBalance: new BigNumber(0),
  stakedBalance: new BigNumber(0.0002),
  balances: [],
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
    }
  | {
      type: "SET_USER_BALANCES";
      balances: TrancheBalance[];
    };

export function redemptionReducer(
  state: RedemptionState,
  action: RedemptionAction
) {
  switch (action.type) {
    case "SET_USER_BALANCES":
      return {
        ...state,
        totalVestedBalance: BigNumber.sum.apply(null, [
          new BigNumber(0),
          ...action.balances.map((b) => b.vested),
        ]),
        totalLockedBalance: BigNumber.sum.apply(null, [
          new BigNumber(0),
          ...action.balances.map((b) => b.locked),
        ]),
        balances: action.balances,
      };
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
