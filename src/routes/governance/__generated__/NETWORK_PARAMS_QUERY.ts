/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NETWORK_PARAMS_QUERY
// ====================================================

export interface NETWORK_PARAMS_QUERY_networkParameters {
  __typename: "NetworkParameter";
  /**
   * The name of the network parameter
   */
  key: string;
  /**
   * The value of the network parameter
   */
  value: string;
}

export interface NETWORK_PARAMS_QUERY {
  /**
   * return the full list of network parameters
   */
  networkParameters: NETWORK_PARAMS_QUERY_networkParameters[] | null;
}
