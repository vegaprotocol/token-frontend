import React from "react";
import Web3 from "web3";
import { useAppState } from "../../contexts/app-state/app-state-context";
import VegaClaim from "../../lib/vega-claim";
import { ICountry } from "./claim-form/claim-form";

export const useValidateCountry = () => {
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
  return {
    country,
    isValid,
    loading,
    checkCountry,
  };
};
