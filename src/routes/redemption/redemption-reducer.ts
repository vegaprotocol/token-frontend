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
  balances: TrancheBalance[];
}

export const initialRedemptionState: RedemptionState = {
  error: null,
  userTranches: [],
  loading: false,
  totalVestedBalance: new BigNumber(0),
  totalLockedBalance: new BigNumber(0),
  balances: [],
};

export enum RedemptionActionType {
  ERROR,
  SET_USER_TRANCHES,
  SET_LOADING,
  SET_USER_BALANCES,
}

export type RedemptionAction =
  | {
      type: RedemptionActionType.ERROR;
      error: Error;
    }
  | {
      type: RedemptionActionType.SET_USER_TRANCHES;
      userTranches: Tranche[];
    }
  | {
      type: RedemptionActionType.SET_LOADING;
      loading: boolean;
    }
  | {
      type: RedemptionActionType.SET_USER_BALANCES;
      balances: TrancheBalance[];
    };

export function redemptionReducer(
  state: RedemptionState,
  action: RedemptionAction
): RedemptionState {
  switch (action.type) {
    case RedemptionActionType.SET_USER_BALANCES:
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
    case RedemptionActionType.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case RedemptionActionType.SET_USER_TRANCHES:
      return {
        ...state,
        userTranches: action.userTranches,
      };
    case RedemptionActionType.ERROR:
      return {
        ...state,
        error: action.error,
      };
  }
}
