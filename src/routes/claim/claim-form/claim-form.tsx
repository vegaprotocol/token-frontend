import React from "react";
import { useTranslation } from "react-i18next";
import { ContinueButton } from "../../../components/continue-button";
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
    <ContinueButton
      isValid={isValid}
      loading={loading}
      onSubmit={onSubmit}
      continueText={t("Continue")}
      errorText={t("You must select a valid country")}
    />
  );
};
