import { useQuery } from "@apollo/client";
import { networkParamsQuery } from "./network-params";

import type { networkParams } from "./__generated__/networkParams";

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
