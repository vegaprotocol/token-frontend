import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { ClaimAction } from "../claim-reducer";
import { useValidateCountry } from "../hooks";

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
  dispatch,
  txState,
  txDispatch,
  onSubmit,
  completed,
}: {
  dispatch: React.Dispatch<ClaimAction>;
  txState: TransactionState;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
  completed: boolean;
}) => {
  const { t } = useTranslation();
  const {
    appState: { chainId },
  } = useAppState();
  const { country, checkCountry, isValid, loading } = useValidateCountry();

  React.useEffect(() => {
    if (country) {
      dispatch({ type: "SET_COUNTRY", countryCode: country.code });
    }
  }, [country, dispatch]);

  if (txState.txState !== TxState.Default || completed) {
    return (
      <TransactionCallout
        chainId={chainId!}
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
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
      <CountrySelector setCountry={checkCountry} />
      {!isValid && country?.code && (
        <div style={{ color: "#ED1515", marginBottom: 20 }}>
          {t(
            "Sorry. It is not possible to claim tokens in your country or region."
          )}
        </div>
      )}
      <button disabled={!isValid || loading} type="submit">
        {loading ? t("Loading") : t("Continue")}
      </button>
    </form>
  );
};
