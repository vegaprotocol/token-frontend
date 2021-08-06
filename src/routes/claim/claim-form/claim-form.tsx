import React from "react";
import { useTranslation } from "react-i18next";
import { ContinueButton } from "../../../components/continue-button";
import { TransactionCallout } from "../../../components/transaction-callout";

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
  isValid,
  loading,
}: {
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
  isValid: boolean;
  loading: boolean;
}) => {
  const { t } = useTranslation();

  if (txState.txState !== TxState.Default) {
    return (
      <TransactionCallout
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
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
