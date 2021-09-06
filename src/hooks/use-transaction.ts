import React from "react";
import type { PromiEvent } from "../lib/web3-utils";
import {
  initialState,
  TransactionActionType,
  transactionReducer,
} from "./transaction-reducer";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react";

export interface TxError {
  message: string;
  code: number;
  data?: unknown;
}

const IgnoreCodes = {
  ALREADY_PROCESSING: 32002,
  USER_REJECTED: 4001,
};

export const useTransaction = (
  performTransaction: (...args: any[]) => PromiEvent,
  checkTransaction?: (...args: any[]) => Promise<any>
) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);

  const isUnexpectedError = (error: Error | TxError) => {
    if ("code" in error && Object.values(IgnoreCodes).includes(error.code)) {
      return false;
    }
    return true;
  };

  const isUserRejection = (error: Error | TxError) => {
    if ("code" in error && error.code === IgnoreCodes.USER_REJECTED) {
      return true;
    }
    return false;
  };

  const handleError = React.useCallback(
    (err: Error) => {
      if (isUnexpectedError(err)) {
        Sentry.captureException(err);
      }

      if (isUserRejection(err)) {
        dispatch({ type: TransactionActionType.TX_RESET });
        return;
      }

      const defaultMessage = t("Something went wrong");
      const errorSubstitutions = {
        unknown: defaultMessage,
        "Transaction has been reverted by the EVM": defaultMessage,
      };
      dispatch({
        type: TransactionActionType.TX_ERROR,
        error: err,
        errorSubstitutions,
      });
    },
    [dispatch, t]
  );

  const perform = React.useCallback(async () => {
    dispatch({ type: TransactionActionType.TX_REQUESTED });
    try {
      if (typeof checkTransaction === "function") {
        await checkTransaction();
      }
      const sub = performTransaction()
        .on("transactionHash", (hash: string) => {
          dispatch({ type: TransactionActionType.TX_SUBMITTED, txHash: hash });
        })
        .on("receipt", (receipt: any) => {
          sub.off();
          dispatch({ type: TransactionActionType.TX_COMPLETE, receipt });
        })
        .on("error", (err: Error) => {
          sub.off();
          handleError(err);
        });
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
