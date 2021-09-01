import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { addDays } from "date-fns";
import { NodeStatus } from "../../../__generated__/globalTypes";
import { STAKING_QUERY } from "../../../routes/staking/staking";
import {
  Staking,
  Staking_nodeData,
  Staking_nodes,
} from "../../../routes/staking/__generated__/Staking";
import { STAKE_NODE_QUERY } from "../../../routes/staking/staking-node";
import { StakeNode } from "../../../routes/staking/__generated__/StakeNode";
import { PartyDelegations } from "../../../routes/staking/__generated__/PartyDelegations";
import { PARTY_DELEGATIONS_QUERY } from "../../../routes/staking/staking-form";

const partyId = "pub";

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
        id: "1",
        timestamps: {
          __typename: "EpochTimestamps",
          start: new Date().toISOString(),
          end: addDays(new Date(), 1).toISOString(),
        },
      },
      nodeData,
      party: {
        __typename: "Party",
        id: partyId,
        delegations: [
          {
            __typename: "Delegation",
            amount: "100",
            epoch: 1,
          },
          {
            __typename: "Delegation",
            amount: "100",
            epoch: 1,
          },
          {
            __typename: "Delegation",
            amount: "200",
            epoch: 2,
          },
          {
            __typename: "Delegation",
            amount: "200",
            epoch: 2,
          },
        ],
      },
    },
  },
};

const MOCK_PARTY_DELEGATIONS: MockedResponse<PartyDelegations> = {
  request: {
    query: PARTY_DELEGATIONS_QUERY,
    variables: { partyId },
  },
  result: {
    data: {
      party: {
        __typename: "Party",
        delegations: [
          {
            __typename: "Delegation",
            amount: "100",
            epoch: 1,
            node: {
              __typename: "Node",
              id: "node-id-1",
            },
          },
        ],
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
    <MockedProvider
      mocks={[
        MOCK_STAKING_QUERY,
        MOCK_STAKING_NODE_QUERY,
        MOCK_PARTY_DELEGATIONS,
        MOCK_STAKING_NODE_QUERY,
      ]}
    >
      {children}
    </MockedProvider>
  );
};
