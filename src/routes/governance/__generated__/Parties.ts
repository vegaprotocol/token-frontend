/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Parties
// ====================================================

export interface Parties_parties_stake {
  __typename: "PartyStake";
  /**
   * The stake currently available for the party
   */
  currentStakeAvailable: string;
  currentStakeAvailableFormatted: string;
}

export interface Parties_parties {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
  /**
   * The staking informations for this Party
   */
  stake: Parties_parties_stake;
}

export interface Parties {
  /**
   * One or more entities that are trading on the VEGA network
   */
  parties: Parties_parties[] | null;
}
