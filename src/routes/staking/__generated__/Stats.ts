/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Stats
// ====================================================

export interface Stats_statistics {
  __typename: "Statistics";
  /**
   * Current block number
   */
  blockHeight: number;
}

export interface Stats {
  /**
   * a bunch of statistics about the node
   */
  statistics: Stats_statistics;
}
