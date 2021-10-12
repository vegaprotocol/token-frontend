import { BigNumber } from "./bignumber";

export const formatNumber = (value: BigNumber, decimals?: number) => {
  const decimalPlaces = decimals || Math.max(value.dp(), 2);
  return value.dp(decimalPlaces).toFormat(decimalPlaces);
};
