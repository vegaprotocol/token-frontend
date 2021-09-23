import React from "react";
import {
  isUnexpectedError,
  isUserRejection,
  PromiEvent,
  WrappedPromiEvent,
} from "../lib/web3-utils";
import {
  initialState,
  TransactionActionType,
  transactionReducer,
} from "./transaction-reducer";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react";

export const useTransaction = (
  performTransaction:
    | ((...args: any[]) => WrappedPromiEvent<any>)
    | ((...args: any[]) => Promise<WrappedPromiEvent<any>>),
  checkTransaction?: (...args: any[]) => Promise<any>,
  requiredConfirmations?: number
) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);

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
      const sub = performTransaction();
      let promiEvent: PromiEvent<any>;
      if ("promiEvent" in sub) {
        promiEvent = sub.promiEvent;
      } else {
        promiEvent = (await sub).promiEvent;
      }

      promiEvent
        .on("transactionHash", (hash: string) => {
          dispatch({
            type: TransactionActionType.TX_SUBMITTED,
            txHash: hash,
          });
        })
        .on("confirmation", (count: number) => {
          if (requiredConfirmations && count > requiredConfirmations) {
            dispatch({
              type: TransactionActionType.TX_COMPLETE,
              receipt: {},
              confirmations: count,
            });
            promiEvent.off();
          }
        })
        .on("receipt", (receipt: any) => {
          promiEvent.off();
          if (!requiredConfirmations) {
            dispatch({
              type: TransactionActionType.TX_COMPLETE,
              receipt,
              confirmations: 1,
            });
          }
        })
        .on("error", (err: Error) => {
          promiEvent.off();
          handleError(err);
        });
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  }, [
    checkTransaction,
    performTransaction,
    requiredConfirmations,
    handleError,
  ]);

  return {
    state,
    dispatch,
    perform,
  };
};
