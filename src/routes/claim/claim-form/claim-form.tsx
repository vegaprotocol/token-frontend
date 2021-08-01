import React from "react";
import { useTranslation } from "react-i18next";
import Web3 from "web3";
import { CountrySelector } from "../../../components/country-selector";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import VegaClaim from "../../../lib/vega-web3/vega-claim";
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
  country,
  isValid,
  checkCountry,
  loading,
}: {
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  onSubmit: (country: ICountry) => void;
  completed: boolean;
  country: ICountry | null;
  isValid: boolean;
  checkCountry: (country: ICountry) => void;
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
        onSubmit(country!);
      }}
    >
      <fieldset>
        <CountrySelector setCountry={checkCountry} />
        {!isValid && country?.code && (
          <div style={{ color: "#ED1515", marginBottom: 20 }}>
            {t(
              "Sorry. It is not possible to claim tokens in your country or region."
            )}
          </div>
        )}
      </fieldset>
      <button disabled={!isValid || loading}>
        {loading ? t("Loading") : t("Continue")}
      </button>
    </form>
  );
};
