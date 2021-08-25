export interface AssociateState {
  error: Error | null;
  amount: string;
}

export const initialAssociateState: AssociateState = {
  error: null,
  amount: "",
};

export enum AssociateActionType {
  ERROR,
  SET_AMOUNT,
}

export type AssociateAction =
  | {
      type: AssociateActionType.ERROR;
      error: Error;
    }
  | {
      type: AssociateActionType.SET_AMOUNT;
      amount: string;
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
  }
}
