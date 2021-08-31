/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PartyDelegations
// ====================================================

export interface PartyDelegations_party_delegations {
  __typename: "Delegation";
  /**
   * Amount delegated
   */
  amount: string;
  /**
   * URL of node you are delegating to
   */
  node: string;
  /**
   * Epoch of delegation
   */
  epoch: number;
}

export interface PartyDelegations_party {
  __typename: "Party";
  delegations: PartyDelegations_party_delegations[] | null;
}

export interface PartyDelegations {
  /**
   * An entity that is trading on the VEGA network
   */
  party: PartyDelegations_party | null;
}

export interface PartyDelegationsVariables {
  partyId: string;
}
