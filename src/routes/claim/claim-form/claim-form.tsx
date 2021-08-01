import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
import { TransactionComplete } from "../../../components/transaction-complete";
import { TransactionConfirm } from "../../../components/transaction-confirm";
import { TransactionError } from "../../../components/transaction-error";
import { TransactionsInProgress } from "../../../components/transaction-in-progress";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../transaction-reducer";

export interface ICountry {
  name: string;
  isValid: boolean;
  code: string;
  id: number;
}

export const ClaimForm = ({
  state,
  dispatch,
  onSubmit,
  completed,
}: {
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  onSubmit: () => void;
  completed: boolean;
}) => {
  const [country, setCountry] = React.useState<ICountry | null>(null);
  const { t } = useTranslation();
  const {
    appState: { chainId },
  } = useAppState();
  if (state.txState === TxState.Error) {
    return (
      <TransactionError
        error={state.txData.error}
        hash={state.txData.hash}
        onActionClick={() => dispatch({ type: "TX_RESET" })}
        chainId={chainId!}
      />
    );
  }

  if (state.txState === TxState.Pending) {
    return (
      <TransactionsInProgress hash={state.txData.hash!} chainId={chainId!} />
    );
  }

  if (state.txState === TxState.Requested) {
    return <TransactionConfirm />;
  }

  if (state.txState === TxState.Complete || completed) {
    return (
      <TransactionComplete
        hash={state.txData.hash!}
        chainId={chainId!}
        showLink={!completed}
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
      <fieldset>
        <CountrySelector setCountry={setCountry} />
        {country && !country.isValid && country.id !== 0 && (
          <div style={{ color: "#ED1515", marginBottom: 20 }}>
            {t(
              "Sorry. It is not possible to claim tokens in your country or region."
            )}
          </div>
        )}
      </fieldset>
      <button disabled={!country?.isValid}>{t("Continue")}</button>
    </form>
  );
};
