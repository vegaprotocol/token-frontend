import React from "react";
import { useTranslation } from "react-i18next";
import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TransactionCallout } from "../../../components/transaction-callout";
import { ContinueButton } from "../../../components/continue-button/continue-button";
import { BigNumber } from "../../../lib/bignumber";

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
  amount: BigNumber;
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
  loading: boolean;
  isValid: boolean;
}) => {
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
    content = (
      <ContinueButton
        isValid={step1Completed && isValid}
        loading={loading}
        onSubmit={onSubmit}
        continueText={t("Claim {amount} Vega", { amount })}
        errorText={t("You must select a valid country")}
      />
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
