import React from "react";
import { useVegaClaim } from "../../hooks/use-vega-claim";
import { ICountry } from "./claim-form/claim-form";

export const useValidateCountry = () => {
  const [country, setCountry] = React.useState<ICountry | null>(null);
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const claim = useVegaClaim();

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
