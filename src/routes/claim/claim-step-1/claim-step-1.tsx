import { useTranslation } from "react-i18next";
import { ClaimForm } from "../claim-form";
import { ClaimAction } from "../claim-reducer";
import { TransactionAction, TransactionState } from "../transaction-reducer";

interface ClaimStep2 {
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  completed: boolean;
  onSubmit: () => void;
  dispatch: React.Dispatch<ClaimAction>;
}

export const ClaimStep1 = ({
  txState,
  txDispatch,
  completed,
  onSubmit,
  dispatch,
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
        txState={txState}
        txDispatch={txDispatch}
        completed={completed}
        onSubmit={onSubmit}
        dispatch={dispatch}
      />
    </div>
  );
};
