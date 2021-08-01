import { useTranslation } from "react-i18next";
import { ClaimForm } from "../claim-form";
import { ICountry } from "../claim-form/claim-form";
import { TransactionAction, TransactionState } from "../transaction-reducer";

interface ClaimStep2 {
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  completed: boolean;
  onSubmit: () => void;
  country: ICountry | null;
  isValid: boolean;
  checkCountry: (country: ICountry) => void;
  loading: boolean;
}

export const ClaimStep1 = ({
  state,
  dispatch,
  completed,
  onSubmit,
  country,
  isValid,
  checkCountry,
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
        justifyContent: "space-between ",
      }}
    >
      <h1>{t("step1Title")}</h1>
      <p>{t("step1Body")}</p>
      <ClaimForm
        country={country}
        isValid={isValid}
        checkCountry={checkCountry}
        loading={loading}
        completed={completed}
        state={state}
        onSubmit={onSubmit}
        dispatch={dispatch}
      />
    </div>
  );
};
