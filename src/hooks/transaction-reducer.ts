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
    userFacingError?: Error | null;
  };
}

export const initialState: TransactionState = {
  // claim tx
  txState: TxState.Default,
  txData: {
    hash: null,
    receipt: null,
    error: null,
    userFacingError: null,
  },
};

const substituteErrorMessage = (
  errMessage: string,
  errorSubstitutions: { [errMessage: string]: string }
): Error => {
  let newErrorMessage = errorSubstitutions.unknown;

  Object.keys(errorSubstitutions).forEach((errorSubstitutionKey) => {
    if (errMessage.includes(errorSubstitutionKey)) {
      newErrorMessage = errorSubstitutions[errorSubstitutionKey];
    }
  });
  return new Error(newErrorMessage);
};

export enum TransactionActionType {
  TX_RESET,
  TX_REQUESTED,
  TX_SUBMITTED,
  TX_COMPLETE,
  TX_ERROR,
}

export type TransactionAction =
  | {
      type: TransactionActionType.TX_RESET;
    }
  | {
      type: TransactionActionType.TX_REQUESTED;
    }
  | {
      type: TransactionActionType.TX_SUBMITTED;
      txHash: string;
    }
  | {
      type: TransactionActionType.TX_COMPLETE;
      receipt: any;
    }
  | {
      type: TransactionActionType.TX_ERROR;
      error: Error;
      errorSubstitutions: { [errMessage: string]: string };
    };

export function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case TransactionActionType.TX_RESET:
      return {
        ...state,
        txState: TxState.Default,
        txData: {
          hash: null,
          receipt: null,
          error: null,
        },
      };
    case TransactionActionType.TX_REQUESTED:
      return {
        ...state,
        txState: TxState.Requested,
      };
    case TransactionActionType.TX_SUBMITTED: {
      return {
        ...state,
        txState: TxState.Pending,
        txData: {
          ...state.txData,
          hash: action.txHash,
        },
      };
    }
    case TransactionActionType.TX_COMPLETE:
      return {
        ...state,
        txState: TxState.Complete,
        txData: {
          ...state.txData,
          receipt: action.receipt,
        },
      };
    case TransactionActionType.TX_ERROR:
      return {
        ...state,
        txState: TxState.Error,
        txData: {
          ...state.txData,
          userFacingError: substituteErrorMessage(
            action.error.message,
            action.errorSubstitutions
          ),
          error: action.error,
        },
      };
  }
}
