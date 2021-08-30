/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NodeStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: Node
// ====================================================

export interface Node_node_epochData {
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

export interface Node_node {
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
  epochData: Node_node_epochData | null;
  status: NodeStatus;
}

export interface Node_epoch_timestamps {
  __typename: "EpochTimestamps";
  /**
   * RFC3339 timestamp - Vega time of epoch start, null if not started
   */
  start: string | null;
  /**
   * RFC3339 timestamp - Vega time of epoch end, null if not ended
   */
  end: string | null;
}

export interface Node_epoch {
  __typename: "Epoch";
  /**
   * Presumably this is an integer or something. If there's no such thing, disregard
   */
  id: string;
  /**
   * Timestamps for start/end etc
   */
  timestamps: Node_epoch_timestamps;
}

export interface Node {
  /**
   * specific node in network
   */
  node: Node_node | null;
  /**
   * get data for a specific epoch, if id omitted it gets the current epoch
   */
  epoch: Node_epoch;
}

export interface NodeVariables {
  nodeId: string;
}
