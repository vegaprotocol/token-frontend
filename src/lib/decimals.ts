import { BigNumber } from "bignumber.js";

export function addDecimal(value: BigNumber, decimals: number): string {
  return value.dividedBy(Math.pow(10, decimals)).toFixed(decimals);
}
export function removeDecimal(value: BigNumber, decimals: number): string {
  return value.times(Math.pow(10, decimals)).toFixed(0);
}
