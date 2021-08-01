import { useTranslation } from "react-i18next";
import BN from "bn.js";
import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../transaction-reducer";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TransactionCallout } from "../../../components/transaction-callout";

export const ClaimStep2 = ({
  step1Completed,
  amount,
  state,
  dispatch,
  onSubmit,
}: {
  step1Completed: boolean;
  amount: BN;
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  onSubmit: () => void;
}) => {
  const { appState } = useAppState();
  const { chainId } = appState;
  const { t } = useTranslation();
  let content = null;
  if (state.txState !== TxState.Default) {
    content = (
      <TransactionCallout
        chainId={chainId!}
        state={state}
        reset={() => dispatch({ type: "TX_RESET" })}
        complete={false}
      />
    );
  } else {
    content = (
      <button disabled={!step1Completed} onClick={onSubmit}>
        {t("Claim {amount} Vega", { amount })}
      </button>
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
      <p>{t("step2Body")}</p>
      {step1Completed ? (
        content
      ) : (
        <p style={{ color: "#767676" }}>{t("step2Note")}</p>
      )}
    </div>
  );
};
