import React from "react";
import { countryData } from "./countryData";

export interface CountriesProps {
    setIsValidCountry: (isValid: boolean) => void
}

export const Countries = ({setIsValidCountry}: CountriesProps) => {    
    const onSelectedCountry = (selectedCountryCode: string) => {
        const selectedCountry = countryData.filter(country => (country.code === selectedCountryCode))[0]
        setIsValidCountry(selectedCountry.isValid)
    }

    return (
        <>
        <select onChange={(value) => onSelectedCountry(value.currentTarget.value)}>
            {
                countryData.map(country => (
                <option
                    key={country.code}
                    value={country.code}
                >
                    {country.name}
                </option>
                ))
            }
        </select>
        </>
    )
}