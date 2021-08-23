import { BigNumber } from '../lib/bignumber'
import {Decimals, EthereumChainIds} from "./web3-utils";

export function addDecimal(value: BigNumber, decimals: number = Decimals[EthereumChainIds.Mainnet]): string {
  return value.dividedBy(Math.pow(10, decimals)).decimalPlaces(decimals).toString();
}
export function removeDecimal(value: BigNumber, decimals: number): string {
  return value.times(Math.pow(10, decimals)).toFixed(0);
}
