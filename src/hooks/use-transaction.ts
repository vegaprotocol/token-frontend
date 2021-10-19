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
      console.log(tx);

      dispatch({
        type: TransactionActionType.TX_SUBMITTED,
        txHash: tx.hash,
      });

      console.log("waiting for", requiredConfirmations);

      const receipt = await tx.wait(requiredConfirmations);
      console.log(receipt);

      dispatch({
        type: TransactionActionType.TX_COMPLETE,
        receipt,
        confirmations: receipt.confirmations,
      });
    } catch (err) {
      console.log(err);
      handleError(err as Error);
    }
  }, [performTransaction, requiredConfirmations, handleError]);

  return {
    state,
    dispatch,
    perform,
  };
};
