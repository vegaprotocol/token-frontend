import { useNetworkParam } from "./use-network-param";
import { BigNumber } from "../lib/bignumber";
import { addDecimal } from "../lib/decimals";

const MIN_DELEGATION_PARAM = "spam.protection.delegation.min.tokens";

export function useMinDelegation(): BigNumber {
  const { data, loading } = useNetworkParam([MIN_DELEGATION_PARAM]);

  if (!data || loading) {
    return new BigNumber(0);
  }

  const value = addDecimal(new BigNumber(data[0]), 18);

  return new BigNumber(value);
}
