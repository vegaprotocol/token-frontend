import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
import { TransactionComplete } from "../../../components/transaction-complete";
import { TransactionConfirm } from "../../../components/transaction-confirm";
import { TransactionError } from "../../../components/transaction-error";
import { TransactionsInProgress } from "../../../components/transaction-in-progress";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { ClaimAction, ClaimState, TxState } from "./claim-reducer";

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
}: {
  state: ClaimState;
  dispatch: (action: ClaimAction) => void;
  onSubmit: () => void;
}) => {
  const [country, setCountry] = React.useState<ICountry | null>(null);
  const { t } = useTranslation();
  const {
    appState: { chainId },
  } = useAppState();
  console.log(chainId);
  if (state.claimTxState === TxState.Error) {
    return (
      <TransactionError
        error={state.claimTxData.error}
        hash={state.claimTxData.hash}
        onActionClick={() => dispatch({ type: "CLAIM_TX_RESET" })}
        chainId={chainId!}
      />
    );
  }

  if (state.claimTxState === TxState.Pending) {
    return (
      <TransactionsInProgress
        hash={state.claimTxData.hash!}
        chainId={chainId!}
      />
    );
  }

  if (state.claimTxState === TxState.Requested) {
    return <TransactionConfirm />;
  }

  if (state.claimTxState === TxState.Complete) {
    return (
      <TransactionComplete hash={state.claimTxData.hash!} chainId={chainId!} />
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
