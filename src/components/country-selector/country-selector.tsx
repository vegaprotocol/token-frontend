import "./country-selector.scss";

import React from "react";
import countryData from "./country-data";
import { ICountry } from "../../routes/claim/claim-form/claim-form";
import { useTranslation } from "react-i18next";

export interface CountrySelectorProps {
  setCountry: (country: ICountry) => void;
}

export const CountrySelector = ({ setCountry }: CountrySelectorProps) => {
  const { t } = useTranslation();
  const onSelectedCountry = (selectedCountryCode: string) => {
    const selectedCountry = countryData.filter(
      (country) => country.code === selectedCountryCode
    )[0];
    setCountry(selectedCountry);
  };

  return (
    <div>
      <label>{t("Select your country or region of current residence")}:</label>
      <select
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
