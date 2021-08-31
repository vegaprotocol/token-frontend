/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NodeStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: Nodes
// ====================================================

export interface Nodes_nodes_epochData {
  __typename: "EpochData";
  /**
   * Total number of epochs since node was created
   */
  total: number;
  /**
   * Total number of offline epochs since node was created
   */
  offline: number;
  /**
   * Total number of online epochs since node was created
   */
  online: number;
}

export interface Nodes_nodes {
  __typename: "Node";
  /**
   * The node url eg n01.vega.xyz
   */
  id: string;
  /**
   * Pubkey of the node operator
   */
  pubkey: string;
  /**
   * URL where I can find out more info on the node. Will this be possible?
   */
  infoUrl: string;
  /**
   * Country code for the location of the node
   */
  location: string;
  /**
   * The amount the node has put up themselves
   */
  stakedByOperator: string;
  /**
   * The amount of stake that has been delegated by token holders
   */
  stakedByDelegates: string;
  /**
   * Total amount staked on node
   */
  stakedTotal: string;
  /**
   * Amount of stake on the next epoch
   */
  pendingStake: string;
  epochData: Nodes_nodes_epochData | null;
  status: NodeStatus;
}

export interface Nodes {
  /**
   * all known network nodes
   */
  nodes: Nodes_nodes[] | null;
}
