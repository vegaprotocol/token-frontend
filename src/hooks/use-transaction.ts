import React from "react";
import type { PromiEvent } from "../lib/web3-utils";
import { initialState, transactionReducer } from "./transaction-reducer";
import { useTranslation } from "react-i18next";

export const useTransaction = (
  performTransaction: (...args: any[]) => PromiEvent,
  checkTransaction?: (...args: any[]) => Promise<any>
) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);

  const handleError = React.useCallback(
    (err: Error) => {
      const defaultMessage = t("Something went wrong");
      const errorSubstitutions = {
        unknown: defaultMessage,
        "Transaction has been reverted by the EVM": defaultMessage,
      };
      dispatch({ type: "TX_ERROR", error: err, errorSubstitutions });
    },
    [dispatch, t]
  );

  const perform = React.useCallback(async () => {
    dispatch({ type: "TX_REQUESTED" });
    try {
      if (typeof checkTransaction === "function") {
        await checkTransaction();
      }
      performTransaction()
        .on("transactionHash", (hash: string) => {
          dispatch({ type: "TX_SUBMITTED", txHash: hash });
        })
        .on("receipt", (receipt: any) => {
          dispatch({ type: "TX_COMPLETE", receipt });
        })
        .on("error", (err: Error) => handleError(err));
    } catch (err) {
      handleError(err);
    }
  }, [performTransaction, checkTransaction, dispatch, handleError]);

  return {
    state,
    dispatch,
    perform,
  };
};
