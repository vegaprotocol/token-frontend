import { useTranslation } from "react-i18next";
import { ClaimForm } from "../claim-form";
import {
  TransactionAction,
  TransactionState,
} from "../../../hooks/transaction-reducer";

interface ClaimStep2 {
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  completed: boolean;
  onSubmit: () => void;
  loading: boolean;
  isValid: boolean;
}

export const ClaimStep1 = ({
  txState,
  txDispatch,
  completed,
  onSubmit,
  loading,
  isValid,
}: ClaimStep2) => {
  const { t } = useTranslation();
  return (
    <div
      data-testid="claim-step-1"
      style={{
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h1>{t("step1Title")}</h1>
      <p>{t("step1Body")}</p>
      <ClaimForm
        isValid={isValid}
        loading={loading}
        txState={txState}
        txDispatch={txDispatch}
        completed={completed}
        onSubmit={onSubmit}
      />
    </div>
  );
};
