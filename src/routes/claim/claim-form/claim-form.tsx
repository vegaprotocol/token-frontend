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
  const [showError, setShowError] = React.useState(false)
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

  const disabled = !isValid || loading;
  const onClick = () => {
    setShowError(disabled)
    if (!disabled) {
      onSubmit();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={onClick}
        style={
          disabled
            ? {
                cursor: "not-allowed",
                backgroundColor: "#c2c2c2",
                color: "#767676",
              }
            : {}
        }
      >
        {loading ? t("Loading") : t("Continue")}
      </button>
      {
        showError ? 
          <p style={{ color: "red" }}>{t("You must select a valid country")}</p>
        : null
      }
    </div>
  );
};
