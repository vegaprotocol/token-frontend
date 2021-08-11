import countryData from "./country-data";

export interface CountrySelectorProps {
  onSelectCountry: (countryCode: string) => void;
}

export const CountrySelector = ({ onSelectCountry }: CountrySelectorProps) => {
  const name = "country-selector";

  return (
    <select
      name={name}
      id={name}
      className="country-selector"
      onChange={(value) => onSelectCountry(value.currentTarget.value)}
    >
      {countryData.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};
