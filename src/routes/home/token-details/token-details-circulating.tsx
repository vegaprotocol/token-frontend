import React from "react";
import { BigNumber } from "../../../lib/bignumber"
import { addDecimal } from "../../../lib/decimals";
import { Tranche } from "../../../lib/vega-web3/vega-web3-types";

/**
 * Add together the reedeemed tokens from all tranches
 *
 * @param tranches All of the tranches to sum
 * @param decimals decimal places for the formatted result
 * @return Total redeemed vouchers, formatted as a string
 */
export function sumRedeemedTokens(tranches: Tranche[] | null, decimals: number): string {
  let totalCirculating: BigNumber = new BigNumber(0);

  tranches?.forEach( tranche => totalCirculating = totalCirculating.plus(tranche.total_removed))

  return addDecimal(totalCirculating, decimals)
}

/**
 * Renders a table cell containing the total circulating number of Vega tokens, which is the
 * sum of all redeemed tokens across all tranches
 *
 * @param tranches An array of all of the tranches
 * @param decimals Decimal places for this token
 * @constructor
 */
export const TokenDetailsCirculating = ({ tranches, decimals }: { tranches: Tranche[] | null, decimals: number}) => {
  const totalCirculating = sumRedeemedTokens(tranches, decimals)
  return (<td>{totalCirculating}</td>);
}
