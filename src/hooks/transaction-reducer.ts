export enum TxState {
  Default,
  Requested,
  Pending,
  Complete,
  Error,
}

export interface TransactionState {
  // claim form state
  txState: TxState;
  txData: {
    hash: string | null;
    receipt: object | null;
    error: Error | null;
  };
}

export const initialState: TransactionState = {
  // claim tx
  txState: TxState.Default,
  txData: {
    hash: null,
    receipt: null,
    error: null,
  },
};

const substituteErrorMessage = (
  errMessage: string,
  errorSubstitutions: any
): Error => {
  let newErrorMessage = errMessage;

  Object.keys(errorSubstitutions).forEach((errorSubstitutionKey) => {
    if (errMessage.includes(errorSubstitutionKey)) {
      newErrorMessage = errorSubstitutions[errorSubstitutionKey];
    }
  });
  return new Error(newErrorMessage);
};

export type TransactionAction =
  | {
      type: "TX_RESET";
    }
  | {
      type: "TX_REQUESTED";
    }
  | {
      type: "TX_SUBMITTED";
      txHash: string;
    }
  | {
      type: "TX_COMPLETE";
      receipt: any;
    }
  | {
      type: "TX_ERROR";
      error: Error;
      errorSubstitutions: Object;
    }
  | {
      type: "ERROR";
      error: Error;
    };

export function transactionReducer(
  state: TransactionState,
  action: TransactionAction
) {
  switch (action.type) {
    case "TX_RESET":
      return {
        ...state,
        txState: TxState.Default,
        txData: {
          hash: null,
          receipt: null,
          error: null,
        },
      };
    case "TX_REQUESTED":
      return {
        ...state,
        txState: TxState.Requested,
      };
    case "TX_SUBMITTED": {
      return {
        ...state,
        txState: TxState.Pending,
        txData: {
          ...state.txData,
          hash: action.txHash,
        },
      };
    }
    case "TX_COMPLETE":
      return {
        ...state,
        txState: TxState.Complete,
        txData: {
          ...state.txData,
          receipt: action.receipt,
        },
      };
    case "TX_ERROR":
      return {
        ...state,
        txState: TxState.Error,
        txData: {
          ...state.txData,
          error: substituteErrorMessage(action.error.message, action.errorSubstitutions),
        },
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
