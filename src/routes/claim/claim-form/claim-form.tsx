import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
import { TransactionComplete } from "../../../components/transaction-complete";
import { TransactionConfirm } from "../../../components/transaction-confirm";
import { TransactionError } from "../../../components/transaction-error";
import { TransactionsInProgress } from "../../../components/transaction-in-progress";
import { ClaimState, TxState } from "./claim-reducer";

export const ClaimForm = ({
  state,
  onSubmit,
}: {
  state: ClaimState;
  onSubmit: () => void;
}) => {
  const [isValidCountry, setIsValidCountry] = React.useState(false);
  const countryValidator = (isValid: boolean) => {
    setIsValidCountry(isValid);
  };
  const { t } = useTranslation();

  if (state.claimTxState === TxState.Error) {
    return <TransactionError error={state.claimTxData.error} />;
  }

  if (state.claimTxState === TxState.Pending) {
    return <TransactionsInProgress hash={state.claimTxData.hash} />;
  }

  if (state.claimTxState === TxState.Requested) {
    return <TransactionConfirm />;
  }

  if (state.claimTxState === TxState.Complete) {
    return <TransactionComplete />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <fieldset>
        <CountrySelector setIsValidCountry={countryValidator} />
      </fieldset>
      <button disabled={!isValidCountry}>{t("Continue")}</button>
    </form>
  );
};
