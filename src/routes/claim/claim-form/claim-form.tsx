import React from "react";
import { useTranslation } from "react-i18next";
import { TransactionCallout } from "../../../components/transaction-callout";
import * as Sentry from "@sentry/react";

import {
  TransactionAction,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { Redirect } from "react-router";

export interface ICountry {
  name: string;
  code: string;
}

enum CountryCheck {
  Default,
  Pending,
  Allowed,
  Blocked,
}

export const ClaimForm = ({
  txState,
  countryCode,
  txDispatch,
  onSubmit,
}: {
  txState: TransactionState;
  countryCode: string;
  txDispatch: React.Dispatch<TransactionAction>;
  onSubmit: () => void;
}) => {
  const [countryCheck, setCountryCheck] = React.useState(CountryCheck.Default);
  const claim = useVegaClaim();
  const { t } = useTranslation();

  const handleOnClick = React.useCallback(async () => {
    setCountryCheck(CountryCheck.Pending);
    try {
      const blocked = await claim.isCountryBlocked(countryCode);
      if (!blocked) {
        setCountryCheck(CountryCheck.Allowed);
        onSubmit();
      } else {
        setCountryCheck(CountryCheck.Blocked);
      }
    } catch (err) {
      Sentry.captureEvent(err);
      setCountryCheck(CountryCheck.Blocked);
    }
  }, [claim, countryCode, onSubmit]);

  if (countryCheck === CountryCheck.Blocked) {
    return <Redirect to="/invalid-country" />;
  }

  if (txState.txState !== TxState.Default) {
    return (
      <TransactionCallout
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
      />
    );
  }

  return (
    <button type="submit" onClick={handleOnClick} className="fill">
      {countryCheck === CountryCheck.Pending
        ? t("verifyingCountryPrompt")
        : t("Continue")}
    </button>
  );
};
