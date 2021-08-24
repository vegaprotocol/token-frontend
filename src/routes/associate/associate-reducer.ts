import { BigNumber } from "../../lib/bignumber";

export interface AssociateState {
  error: Error | null;
  stakedBalance: BigNumber;
  amount: string;
}

export const initialAssociateState: AssociateState = {
  error: null,
  stakedBalance: new BigNumber(0),
  amount: "",
};

export enum AssociateActionType {
  ERROR,
  SET_AMOUNT,
  SET_STAKED_BALANCE,
}

export type AssociateAction =
  | {
      type: AssociateActionType.ERROR;
      error: Error;
    }
  | {
      type: AssociateActionType.SET_AMOUNT;
      amount: string;
    }
  | {
      type: AssociateActionType.SET_STAKED_BALANCE;
      stakedBalance: BigNumber;
    };

export function associateReducer(
  state: AssociateState,
  action: AssociateAction
): AssociateState {
  switch (action.type) {
    case AssociateActionType.ERROR:
      return {
        ...state,
        error: action.error,
      };
    case AssociateActionType.SET_AMOUNT:
      return {
        ...state,
        amount: action.amount,
      };
    case AssociateActionType.SET_STAKED_BALANCE:
      return {
        ...state,
        stakedBalance: action.stakedBalance,
      };
  }
}
