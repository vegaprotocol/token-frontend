import { BigNumber } from "../../lib/bignumber";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";

export interface TrancheBalance {
  id: number;
  locked: BigNumber;
  vested: BigNumber;
}

export interface RedemptionState {
  userTranches: Tranche[];
}

export const initialRedemptionState: RedemptionState = {
  userTranches: [],
};

export enum RedemptionActionType {
  SET_USER_TRANCHES,
}

export type RedemptionAction = {
  type: RedemptionActionType.SET_USER_TRANCHES;
  userTranches: Tranche[];
};

export function redemptionReducer(
  state: RedemptionState,
  action: RedemptionAction
): RedemptionState {
  switch (action.type) {
    case RedemptionActionType.SET_USER_TRANCHES:
      return {
        ...state,
        userTranches: action.userTranches,
      };
  }
}
