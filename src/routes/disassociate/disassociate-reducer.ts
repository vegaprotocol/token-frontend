export interface DisassociateState {
  error: Error | null;
  amount: string;
}

export const initialDisassociateState: DisassociateState = {
  error: null,
  amount: "",
};

export enum DisassociateActionType {
  ERROR,
  SET_AMOUNT,
}

export type DisassociateAction =
  | {
      type: DisassociateActionType.ERROR;
      error: Error;
    }
  | {
      type: DisassociateActionType.SET_AMOUNT;
      amount: string;
    };

export function disassociateReducer(
  state: DisassociateState,
  action: DisassociateAction
): DisassociateState {
  switch (action.type) {
    case DisassociateActionType.ERROR:
      return {
        ...state,
        error: action.error,
      };
    case DisassociateActionType.SET_AMOUNT:
      return {
        ...state,
        amount: action.amount,
      };
  }
}
