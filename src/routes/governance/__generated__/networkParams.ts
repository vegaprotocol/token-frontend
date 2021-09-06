/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: networkParams
// ====================================================

export interface networkParams_networkParameters {
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

export interface networkParams {
  /**
   * return the full list of network parameters
   */
  networkParameters: networkParams_networkParameters[] | null;
}
