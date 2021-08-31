import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { NodeStatus } from "../../../__generated__/globalTypes";
import { STAKING_QUERY } from "../../../routes/staking/staking";
import {
  Staking,
  Staking_nodeData,
  Staking_nodes,
} from "../../../routes/staking/__generated__/Staking";
import { STAKE_NODE_QUERY } from "../../../routes/staking/staking-node";
import { StakeNode } from "../../../routes/staking/__generated__/StakeNode";

const partyId = "0x789";

const nodes: Staking_nodes[] = [
  {
    __typename: "Node",
    id: "node-id-1",
    pubkey: "pubkey",
    infoUrl: "",
    location: "",
    stakedByOperator: "100",
    stakedByDelegates: "100",
    stakedTotal: "200",
    pendingStake: "100",
    epochData: {
      __typename: "EpochData",
      total: 6,
      offline: 1,
      online: 5,
    },
    status: NodeStatus.NonValidator,
  },
  {
    __typename: "Node",
    id: "node-id-2",
    pubkey: "pubkey",
    infoUrl: "",
    location: "",
    stakedByOperator: "100",
    stakedByDelegates: "100",
    stakedTotal: "200",
    pendingStake: "100",
    epochData: {
      __typename: "EpochData",
      total: 6,
      offline: 1,
      online: 5,
    },
    status: NodeStatus.Validator,
  },
];

const nodeData: Staking_nodeData = {
  __typename: "NodeData",
  stakedTotal: "500",
  totalNodes: 5,
  inactiveNodes: 3,
  validatingNodes: 1,
  uptime: 1234567687,
};

const MOCK_STAKING_QUERY: MockedResponse<Staking> = {
  request: {
    query: STAKING_QUERY,
    variables: { partyId },
  },
  result: {
    data: {
      party: {
        __typename: "Party",
        id: partyId,
        delegations: [
          {
            __typename: "Delegation",
            amount: "100",
            node: nodes[0],
          },
        ],
      },
      nodes,
      nodeData,
    },
  },
};

const MOCK_STAKING_NODE_QUERY: MockedResponse<StakeNode> = {
  request: {
    query: STAKE_NODE_QUERY,
    variables: {
      nodeId: nodes[0].id,
      partyId,
    },
  },
  result: {
    data: {
      node: nodes[0],
      epoch: {
        __typename: "Epoch",
        id: "epoch-1",
        timestamps: {
          __typename: "EpochTimestamps",
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
      },
      nodeData,
      party: {
        __typename: "Party",
        id: partyId,
        delegations: [],
      },
    },
  },
};

export const GraphQlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MockedProvider mocks={[MOCK_STAKING_QUERY, MOCK_STAKING_NODE_QUERY]}>
      {children}
    </MockedProvider>
  );
};
