import { BigNumber } from "bignumber.js";
import { Decimals, EthereumChainId } from "./web3-utils";

const DECIMALS = Decimals[process.env.REACT_APP_CHAIN as EthereumChainId];

export function addDecimal(value: BigNumber, decimals = DECIMALS): string {
  return value.dividedBy(Math.pow(10, decimals)).toFixed(decimals);
}
export function removeDecimal(value: BigNumber, decimals = DECIMALS): string {
  return value.times(Math.pow(10, decimals)).toFixed(0);
}
