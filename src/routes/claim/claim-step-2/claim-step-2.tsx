import React from "react";
import { useTranslation } from "react-i18next";
import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";
import { TransactionCallout } from "../../../components/transaction-callout";
import { ContinueButton } from "../../../components/continue-button";
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
  const { t } = useTranslation();

  if (txState.txState !== TxState.Default) {
    return (
      <TransactionCallout
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
        // complete={false}
      />
    );
  }

  return (
    <div data-testid="claim-step-2">
      <ContinueButton
        isValid={step1Completed && isValid}
        loading={loading}
        onSubmit={onSubmit}
        continueText={t("Claim {amount} Vega", { amount })}
        errorText={t("You must select a valid country")}
      />
    </div>
  );
};
