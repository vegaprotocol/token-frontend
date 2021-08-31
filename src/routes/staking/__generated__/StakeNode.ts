/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NodeStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: StakeNode
// ====================================================

export interface StakeNode_node_epochData {
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

export interface StakeNode_node {
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
  epochData: StakeNode_node_epochData | null;
  status: NodeStatus;
}

export interface StakeNode_epoch_timestamps {
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

export interface StakeNode_epoch {
  __typename: "Epoch";
  /**
   * Presumably this is an integer or something. If there's no such thing, disregard
   */
  id: string;
  /**
   * Timestamps for start/end etc
   */
  timestamps: StakeNode_epoch_timestamps;
}

export interface StakeNode_nodeData {
  __typename: "NodeData";
  /**
   * Total staked amount across all nodes
   */
  stakedTotal: string;
}

export interface StakeNode_party_delegations {
  __typename: "Delegation";
  /**
   * Amount delegated
   */
  amount: string;
  /**
   * Epoch of delegation
   */
  epoch: number;
}

export interface StakeNode_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
  delegations: StakeNode_party_delegations[] | null;
}

export interface StakeNode {
  /**
   * specific node in network
   */
  node: StakeNode_node | null;
  /**
   * get data for a specific epoch, if id omitted it gets the current epoch
   */
  epoch: StakeNode_epoch;
  /**
   * returns information about nodes
   */
  nodeData: StakeNode_nodeData | null;
  /**
   * An entity that is trading on the VEGA network
   */
  party: StakeNode_party | null;
}

export interface StakeNodeVariables {
  nodeId: string;
  partyId: string;
}
