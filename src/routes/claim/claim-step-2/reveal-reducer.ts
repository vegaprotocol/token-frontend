export enum TxState {
  Default,
  Requested,
  Pending,
  Complete,
  Error,
}

export interface RevealState {
  // claim form state
  revealTxState: TxState;
  revealTxData: {
    hash: string | null;
    receipt: object | null;
    error: Error | null;
  };
  // generic
  error: Error | null;
}

export const initialClaimState: RevealState = {
  // claim tx
  revealTxState: TxState.Default,
  revealTxData: {
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
          ...state.revealTxData,
          hash: action.txHash,
        },
      };
    }
    case "REVEAL_TX_COMPLETE":
      return {
        ...state,
        claimTxState: TxState.Complete,
        claimTxData: {
          ...state.revealTxData,
          receipt: action.receipt,
        },
      };
    case "REVEAL_TX_ERROR":
      return {
        ...state,
        claimTxState: TxState.Error,
        claimTxData: {
          ...state.revealTxData,
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
