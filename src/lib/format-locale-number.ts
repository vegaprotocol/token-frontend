import { BigNumber } from "./bignumber";

export const formatLocaleFixedNumber = (value: BigNumber, decimals?: number) => {
  const decimalPlaces =
    typeof decimals === "undefined" ? Math.max(value.dp(), 2) : decimals;

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};
