import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
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
    return <div>{state.claimTxData.error?.message || "Unknown error"}</div>;
  }

  if (state.claimTxState === TxState.Pending) {
    return (
      <div>
        Transaction in progress.{" "}
        <a href={`https://etherscan.io/tx/${state.claimTxData.hash}`}>
          View on Etherscan
        </a>
      </div>
    );
  }

  if (state.claimTxState === TxState.Requested) {
    return <div>Please confirm transaction in your connected wallet</div>;
  }

  if (state.claimTxState === TxState.Complete) {
    return <div>Complete</div>;
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
