import { BigNumber } from "./bignumber";

export const formatNumber = (value: BigNumber) => {
  const decimalPlaces = Math.max(value.dp(), 2);
  console.log(
    new BigNumber(100).dp(2).toString(),
    decimalPlaces,
    value.toString(),
    value.dp(decimalPlaces).toString()
  );
  return value.dp(decimalPlaces).toFormat(decimalPlaces);
};
