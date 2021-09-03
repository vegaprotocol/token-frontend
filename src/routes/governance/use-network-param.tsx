import { useQuery } from '@apollo/client'

import type { networkParams} from './_temp_/networkParams';
import { networkParamsQuery } from './_temp_/network-params'

export function useNetworkParam(params: string[]) {
  const { data, loading, error } = useQuery<networkParams, never>(
    networkParamsQuery
  )
  const foundParams = data?.networkParameters?.filter(p =>
    params.includes(p.key)
  )
  return {
    data: foundParams ? foundParams.map(f => f.value) : null,
    loading,
    error
  }
}
