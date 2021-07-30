export enum TxState {
  Default,
  Requested,
  Pending,
  Complete,
  Error,
}

export interface RevealState {
  // claim form state
  claimTxState: TxState;
  claimTxData: {
    hash: string | null;
    receipt: object | null;
    error: Error | null;
  };
  // generic
  error: Error | null;
}

export const initialClaimState: RevealState = {
  // claim tx
  claimTxState: TxState.Default,
  claimTxData: {
    hash: null,
    receipt: null,
    error: null,
  },
  // generic
  error: null,
};

export type RevealAction =
  | {
      type: "REVEAL_TX_REQUESTED";
    }
  | {
      type: "REVEAL_TX_SUBMITTED";
      txHash: string;
    }
  | {
      type: "REVEAL_TX_COMPLETE";
      receipt: any;
    }
  | {
      type: "REVEAL_TX_ERROR";
      error: Error;
    }
  | {
      type: "ERROR";
      error: Error;
    };

export function revealReducer(state: RevealState, action: RevealAction) {
  switch (action.type) {
    case "REVEAL_TX_REQUESTED":
      return {
        ...state,
        claimTxState: TxState.Requested,
      };
    case "REVEAL_TX_SUBMITTED": {
      return {
        ...state,
        claimTxState: TxState.Pending,
        claimTxData: {
          ...state.claimTxData,
          hash: action.txHash,
        },
      };
    }
    case "REVEAL_TX_COMPLETE":
      return {
        ...state,
        claimTxState: TxState.Complete,
        claimTxData: {
          ...state.claimTxData,
          receipt: action.receipt,
        },
      };
    case "REVEAL_TX_ERROR":
      return {
        ...state,
        claimTxState: TxState.Error,
        claimTxData: {
          ...state.claimTxData,
          error: action.error,
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
