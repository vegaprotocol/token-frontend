import React from "react";
import { PromiEvent } from "../lib/web3-utils";
import {
  initialState,
  transactionReducer,
} from "../routes/claim/transaction-reducer";

export const useTransaction = (
  performTransaction: (...args: any[]) => PromiEvent
) => {
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);
  const perform = React.useCallback(async () => {
    dispatch({ type: "TX_REQUESTED" });
    performTransaction()
      .on("transactionHash", (hash: string) => {
        dispatch({ type: "TX_SUBMITTED", txHash: hash });
      })
      .on("receipt", (receipt: any) => {
        dispatch({ type: "TX_COMPLETE", receipt });
      })
      .on("error", (err: Error) => {
        dispatch({ type: "TX_ERROR", error: err });
      });
  }, [performTransaction, dispatch]);
  return {
    state,
    dispatch,
    perform,
  };
};
