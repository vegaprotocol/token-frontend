import { BigNumber } from "../../lib/bignumber";

export interface AssociateState {
  error: Error | null;
  amount: string;
  lien: BigNumber;
}

export const initialAssociateState: AssociateState = {
  error: null,
  lien: new BigNumber(0),
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
      lien: BigNumber;
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
        lien: action.lien,
      };
  }
}
