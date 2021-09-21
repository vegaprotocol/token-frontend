/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Delegations
// ====================================================

export interface Delegations_epoch {
  __typename: "Epoch";
  /**
   * Presumably this is an integer or something. If there's no such thing, disregard
   */
  id: string;
}

export interface Delegations_party_delegations_node {
  __typename: "Node";
  /**
   * The node url eg n01.vega.xyz
   */
  id: string;
}

export interface Delegations_party_delegations {
  __typename: "Delegation";
  /**
   * Amount delegated
   */
  amount: string;
  /**
   * URL of node you are delegating to
   */
  node: Delegations_party_delegations_node;
  /**
   * Epoch of delegation
   */
  epoch: number;
}

export interface Delegations_party {
  __typename: "Party";
  delegations: Delegations_party_delegations[] | null;
}

export interface Delegations {
  /**
   * get data for a specific epoch, if id omitted it gets the current epoch
   */
  epoch: Delegations_epoch;
  /**
   * An entity that is trading on the VEGA network
   */
  party: Delegations_party | null;
}

export interface DelegationsVariables {
  partyId: string;
}
