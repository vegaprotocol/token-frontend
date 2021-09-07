import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

import type { networkParams } from "./__generated__/networkParams";

export const networkParamsQuery = gql`
  query NETWORK_PARAMS_QUERY {
    NetworkParameters {
      key
      value
    }
  }
`;

export function useNetworkParam(params: string[]) {
  const { data, loading, error } = useQuery<networkParams, never>(
    networkParamsQuery
  );
  const foundParams = data?.networkParameters?.filter((p) =>
    params.includes(p.key)
  );
  return {
    data: foundParams ? foundParams.map((f) => f.value) : null,
    loading,
    error,
  };
}
