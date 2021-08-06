import { useTranslation } from "react-i18next";
import { ClaimForm } from "../claim-form";
import {
  TransactionAction,
  TransactionState,
} from "../../../hooks/transaction-reducer";
import { Callout } from "../../../components/callout";
import { Tick } from "../../../components/icons";

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
    <div data-testid="claim-step-1">
      {completed ? (
        <Callout intent="success" title={t("Complete")} icon={<Tick />}>
          <p>You have already committed your claim</p>
        </Callout>
      ) : (
        <>
          <p>{t("commitBody")}</p>
          <ClaimForm
            isValid={isValid}
            loading={loading}
            txState={txState}
            txDispatch={txDispatch}
            onSubmit={onSubmit}
          />
        </>
      )}
    </div>
  );
};
