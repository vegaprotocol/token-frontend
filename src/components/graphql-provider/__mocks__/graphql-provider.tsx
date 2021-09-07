import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { addDays } from "date-fns";
import {
  NodeStatus,
  ProposalRejectionReason,
  ProposalState,
  VoteValue,
} from "../../../__generated__/globalTypes";
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
import { proposals_proposals } from "../../../routes/governance/__generated__/proposals";
import { PROPOSALS_QUERY } from "../../../routes/governance";

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
        stake: {
          __typename: "PartyStake",
          currentStakeAvailable: "100",
        },
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

// const MOCK_PROPOSALS: MockedResponse<proposals_proposals[]> = {
//   request: {
//     query: PROPOSALS_QUERY,
//     variables: { partyId },
//   },
//   result: {
//     data: [
//       {
//         name: "abc",
//         pending: false,
//         id: "dab4eb13c027c82f1f2c9208aa4fe7c04413f91e5709fa4a44a4c29f4d449266",
//         reference: "",
//         state: ProposalState.Open,
//         datetime: "2021-09-02T13:19:42.157201307Z",
//         rejectionReason: null,
//         party: {
//           id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
//           __typename: "Party",
//         },
//         terms: {
//           closingDatetime: "2022-03-01T00:00:00Z",
//           enactmentDatetime: "2022-08-30T23:00:00Z",
//           change: {
//             networkParameter: {
//               key: "market.fee.factors.makerFee",
//               value: "0.0003",
//               __typename: "NetworkParameter",
//             },
//             __typename: "UpdateNetworkParameter",
//           },
//           __typename: "ProposalTerms",
//         },
//         votes: {
//           yes: {
//             totalTokens: "0",
//             totalWeight: "0",
//             totalNumber: "1",
//             votes: [
//               {
//                 value: VoteValue.Yes,
//                 party: {
//                   id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
//                   __typename: "Party",
//                 },
//                 datetime: "2021-09-02T13:20:23.184093701Z",
//                 __typename: "Vote",
//               },
//             ],
//             __typename: "ProposalVoteSide",
//           },
//           no: {
//             totalTokens: "0",
//             totalWeight: "0",
//             totalNumber: "0",
//             votes: null,
//             __typename: "ProposalVoteSide",
//           },
//           __typename: "ProposalVotes",
//         },
//         __typename: "Proposal",
//       },
//       {
//         name: "123",
//         pending: false,
//         id: "eeeef3ac1b19bfaddf86ba1ce853e092991383ac9d76be3b20f5a254583feeee",
//         reference: "",
//         state: ProposalState.Rejected,
//         datetime: "2021-09-02T13:17:42.490013828Z",
//         rejectionReason: ProposalRejectionReason.EnactTimeTooLate,
//         party: {
//           id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
//           __typename: "Party",
//         },
//         terms: {
//           closingDatetime: "2022-03-30T23:00:00Z",
//           enactmentDatetime: "2022-09-29T23:00:00Z",
//           change: {
//             networkParameter: {
//               key: "governance.proposal.updateNetParam.maxEnact",
//               value: "8761h0m0s",
//               __typename: "NetworkParameter",
//             },
//             __typename: "UpdateNetworkParameter",
//           },
//           __typename: "ProposalTerms",
//         },
//         votes: {
//           yes: {
//             totalTokens: "0",
//             totalWeight: "0",
//             totalNumber: "0",
//             votes: null,
//             __typename: "ProposalVoteSide",
//           },
//           no: {
//             totalTokens: "0",
//             totalWeight: "0",
//             totalNumber: "0",
//             votes: null,
//             __typename: "ProposalVoteSide",
//           },
//           __typename: "ProposalVotes",
//         },
//         __typename: "Proposal",
//       },
//     ],
//   },
// };

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
        // MOCK_PROPOSALS,
      ]}
    >
      {children}
    </MockedProvider>
  );
};
