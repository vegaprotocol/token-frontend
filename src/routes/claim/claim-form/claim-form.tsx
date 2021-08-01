import React from "react";
import { useTranslation } from "react-i18next";
import Web3 from "web3";
import { CountrySelector } from "../../../components/country-selector";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import VegaClaim from "../../../lib/vega-claim";
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
}: {
  state: TransactionState;
  dispatch: (action: TransactionAction) => void;
  onSubmit: () => void;
  completed: boolean;
}) => {
  const [country, setCountry] = React.useState<ICountry | null>(null);
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { provider } = useAppState();
  const claim = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21");
  }, [provider]);
  const checkCountry = React.useCallback(
    async (country: ICountry) => {
      if (country.code === "") {
        setIsValid(false);
      } else {
        setLoading(true);
        try {
          const blocked = await claim.isCountryBlocked(country.code);
          setIsValid(!blocked);
        } catch (e) {
          console.log(e);
          setIsValid(false);
        } finally {
          setLoading(false);
        }
      }
      setCountry(country);
    },
    [claim]
  );
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
