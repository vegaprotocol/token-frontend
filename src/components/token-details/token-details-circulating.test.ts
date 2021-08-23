import { sumRedeemedTokens } from "./token-details-circulating";
import { BigNumber } from "../../lib/bignumber";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";

test('It sums some easy tranches correctly', () => {
  const tranches: Partial<Tranche>[] = [
    { total_removed: new BigNumber("100")},
    { total_removed: new BigNumber("100")},
    { total_removed: new BigNumber("100")}
  ]

  const result = sumRedeemedTokens(tranches as Tranche[], 5)
  expect(result).toEqual("0.003")
})

test('It sums some longer tranches correctly', () => {
  const tranches: Partial<Tranche>[] = [
    { total_removed: new BigNumber("10000000000")},
    { total_removed: new BigNumber("20")},
    { total_removed: new BigNumber("3000")}
  ]

  const result = sumRedeemedTokens(tranches as Tranche[], 5)
  expect(result).toEqual("100000.0302")
})

test('Formats properly using the decimals value', () => {
  const tranches: Partial<Tranche>[] = [
    { total_removed: new BigNumber("10000000000")},
    { total_removed: new BigNumber("20")},
    { total_removed: new BigNumber("3000")}
  ]

  const result = sumRedeemedTokens(tranches as Tranche[], 0)
  expect(result).toEqual("10000003020")
})

test('Handles null tranche array', () => {
  const tranches = null

  const result = sumRedeemedTokens(tranches as any as Tranche[], 0)
  expect(result).toEqual("0")
})
