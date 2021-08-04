import React from "react";
import { useTranslation } from "react-i18next";
import BN from "bn.js";
import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TransactionCallout } from "../../../components/transaction-callout";

export const ClaimStep2 = ({
  step1Completed,
  amount,
  txState,
  txDispatch,
  onSubmit,
  loading,
  isValid,
}: {
  step1Completed: boolean;
  amount: BN;
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
  loading: boolean;
  isValid: boolean;
}) => {
  const [showError, setShowError] = React.useState(false);
  const { appState } = useAppState();
  const { chainId } = appState;
  const { t } = useTranslation();
  let content = null;
  if (txState.txState !== TxState.Default) {
    content = (
      <TransactionCallout
        chainId={chainId!}
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
        complete={false}
      />
    );
  } else {
    const onContinue = () => {
      setShowError(disabled);
      if (!disabled) {
        onSubmit();
      }
    };
    const disabled = !step1Completed || loading || !isValid;
    content = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          style={
            disabled
              ? {
                  cursor: "not-allowed",
                  backgroundColor: "#c2c2c2",
                  color: "#767676",
                }
              : {}
          }
          onClick={onContinue}
        >
          {t("Claim {amount} Vega", { amount })}
        </button>
        {showError ? (
          <p style={{ color: "red" }}>{t("You must select a valid country")}</p>
        ) : null}
      </div>
    );
  }
  return (
    <div
      data-testid="claim-step-2"
      style={{
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between ",
      }}
    >
      <h1>{t("step2Title")}</h1>
      {step1Completed ? (
        content
      ) : (
        <p style={{ color: "#767676" }}>{t("step2Note")}</p>
      )}
    </div>
  );
};
