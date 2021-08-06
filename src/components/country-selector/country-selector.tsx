import countryData from "./country-data";
import { ICountry } from "../../routes/claim/claim-form";

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

  const name = "country-selector";

  return (
    <select
      name={name}
      id={name}
      className="country-selector"
      onChange={(value) => onSelectedCountry(value.currentTarget.value)}
    >
      {countryData.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};
