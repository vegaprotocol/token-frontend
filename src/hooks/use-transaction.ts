import React from "react";
import { isUnexpectedError, isUserRejection } from "../lib/web3-utils";
import {
  initialState,
  TransactionActionType,
  transactionReducer,
} from "./transaction-reducer";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react";

export const useTransaction = (
  performTransaction: () => Promise<any>,
  requiredConfirmations: number = 1
) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(transactionReducer, {
    ...initialState,
    requiredConfirmations,
  });

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
    dispatch({
      type: TransactionActionType.TX_REQUESTED,
    });

    try {
      const tx = await performTransaction();

      dispatch({
        type: TransactionActionType.TX_SUBMITTED,
        txHash: tx.hash,
      });

      let receipt: any;

      for (let i = 1; i <= requiredConfirmations; i++) {
        receipt = await tx.wait(i);
        dispatch({
          type: TransactionActionType.TX_CONFIRMATION,
          confirmations: receipt.confirmations,
        });
      }

      dispatch({
        type: TransactionActionType.TX_COMPLETE,
        receipt,
        confirmations: receipt.confirmations,
      });
    } catch (err) {
      handleError(err as Error);
    }
  }, [performTransaction, requiredConfirmations, handleError]);

  return {
    state,
    dispatch,
    perform,
  };
};
