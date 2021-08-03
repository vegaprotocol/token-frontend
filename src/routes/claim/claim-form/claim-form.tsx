import React from "react";
import { useTranslation } from "react-i18next";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";

import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";

export interface ICountry {
  name: string;
  code: string;
}

export const ClaimForm = ({
  txState,
  txDispatch,
  onSubmit,
  completed,
  isValid,
  loading,
}: {
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
  completed: boolean;
  isValid: boolean;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const {
    appState: { chainId },
  } = useAppState();

  if (txState.txState !== TxState.Default || completed) {
    return (
      <TransactionCallout
        chainId={chainId!}
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
        complete={completed}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <button disabled={!isValid || loading} type="submit">
        {loading ? t("Loading") : t("Continue")}
      </button>
    </form>
  );
};
