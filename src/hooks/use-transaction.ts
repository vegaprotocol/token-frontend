import React from "react";
import type { PromiEvent } from "../lib/vega-web3/vega-claim";
import { initialState, transactionReducer } from "./transaction-reducer";
import { useTranslation } from "react-i18next";

export const useTransaction = (
  performTransaction: (...args: any[]) => PromiEvent
) => {
  const { t } = useTranslation();
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
        const defaultMessage = t("Something went wrong");
        const errorSubstitutions = {
          unknown: defaultMessage,
          "Transaction has been reverted by the EVM": defaultMessage,
        };
        dispatch({ type: "TX_ERROR", error: err, errorSubstitutions });
      });
  }, [performTransaction, dispatch, t]);
  return {
    state,
    dispatch,
    perform,
  };
};
