import React from "react";
import countryData from "./country-data";

export interface CountrySelectorProps {
  setIsValidCountry: (isValid: boolean) => void;
}

export const CountrySelector = ({
  setIsValidCountry,
}: CountrySelectorProps) => {
  const onSelectedCountry = (selectedCountryCode: string) => {
    const selectedCountry = countryData.filter(
      (country) => country.code === selectedCountryCode
    )[0];
    setIsValidCountry(selectedCountry.isValid);
  };

  return (
    <select onChange={(value) => onSelectedCountry(value.currentTarget.value)}>
      {countryData.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};
