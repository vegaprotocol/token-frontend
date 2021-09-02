import { addDecimal } from "./decimals";
import { BigNumber } from "./bignumber";

test('Do not pad numbers with 0s when the number length is less than the specified DPs', () => {
  expect(addDecimal(new BigNumber(10000), 10)).toEqual("0.000001");
})
