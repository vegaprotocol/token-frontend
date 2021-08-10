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
}: {
  step1Completed: boolean;
  amount: BigNumber;
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
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
    <div data-testid="claim-step-2">
      <ContinueButton
        onSubmit={onSubmit}
        continueText={t("Claim {amount} Vega", { amount })}
      />
    </div>
  );
};
