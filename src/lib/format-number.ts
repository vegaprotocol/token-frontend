import { BigNumber } from "./bignumber";

export const formatNumber = (value: BigNumber) => {
  const decimalPlaces = Math.max(value.dp(), 2);
  return value.dp(decimalPlaces).toFormat(decimalPlaces);
};
