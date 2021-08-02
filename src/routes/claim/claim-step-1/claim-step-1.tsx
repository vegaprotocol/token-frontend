import { useTranslation } from "react-i18next";
import { ClaimForm } from "../claim-form";
import { TransactionAction, TransactionState } from "../transaction-reducer";

interface ClaimStep2 {
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  completed: boolean;
  onSubmit: () => void;
  isValid: boolean;
  loading: boolean;
}

export const ClaimStep1 = ({
  state,
  dispatch,
  completed,
  onSubmit,
  isValid,
  loading,
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
        completed={completed}
        state={state}
        onSubmit={onSubmit}
        dispatch={dispatch}
      />
    </div>
  );
};
