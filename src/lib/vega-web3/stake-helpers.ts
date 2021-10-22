import { ethers } from "ethers";
import { BigNumber } from "../../lib/bignumber";
import { addDecimal } from "../decimals";

export function combineStakeEventsByVegaKey(
  events: ethers.Event[],
  decimals: number
): { [vegaKey: string]: BigNumber } {
  const parseAmount = (e: ethers.Event) => {
    const rawAmount = new BigNumber(e.args?.amount.toString() || 0);
    return new BigNumber(addDecimal(rawAmount, decimals));
  };

  const res = events.reduce((obj, e) => {
    const vegaKey = e.args?.vega_public_key;
    const amount = parseAmount(e);
    const isDeposit = e.event === "Stake_Deposited";
    const isRemove = e.event === "Stake_Removed";

    if (!isDeposit && !isRemove) return obj;

    if (obj.hasOwnProperty(vegaKey)) {
      if (isDeposit) {
        obj[vegaKey] = obj[vegaKey].plus(amount);
      } else {
        obj[vegaKey] = obj[vegaKey].minus(amount);
      }
    } else {
      if (isDeposit) {
        obj[vegaKey] = amount;
      } else {
        obj[vegaKey] = new BigNumber(0);
      }
    }
    return obj;
  }, {} as { [vegaKey: string]: BigNumber });

  return res;
}
