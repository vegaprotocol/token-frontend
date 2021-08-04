import "./country-selector.scss";

import React from "react";
import countryData from "./country-data";
import { ICountry } from "../../routes/claim/claim-form/claim-form";

export interface CountrySelectorProps {
  setCountry: (country: ICountry) => void;
}

export const CountrySelector = ({ setCountry }: CountrySelectorProps) => {
  const onSelectedCountry = (selectedCountryCode: string) => {
    const selectedCountry = countryData.filter(
      (country) => country.code === selectedCountryCode
    )[0];
    setCountry(selectedCountry);
  };

  return (
    <div>
      <select
        data-testid="country-selector"
        className="country-selector"
        onChange={(value) => onSelectedCountry(value.currentTarget.value)}
      >
        {countryData.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};
