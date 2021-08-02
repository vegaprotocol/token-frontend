import { useTranslation } from "react-i18next";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";

import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../transaction-reducer";

export interface ICountry {
  name: string;
  code: string;
}

export const ClaimForm = ({
  state,
  dispatch,
  onSubmit,
  completed,
  isValid,
  loading,
}: {
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  onSubmit: () => void;
  completed: boolean;
  isValid: boolean;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const {
    appState: { chainId },
  } = useAppState();
  if (state.txState !== TxState.Default || completed) {
    return (
      <TransactionCallout
        chainId={chainId!}
        state={state}
        reset={() => dispatch({ type: "TX_RESET" })}
        complete={completed}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <button disabled={!isValid || loading}>
        {loading ? t("Loading") : t("Continue")}
      </button>
    </form>
  );
};
