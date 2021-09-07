import { gql } from '@apollo/client'

export const networkParamsQuery = gql`
  query networkParams {
    NetworkParameters {
      key
      value
    }
  }
`
