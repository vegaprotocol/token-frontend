import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { addDays } from "date-fns";
import * as faker from "faker";

import {
  NodeStatus,
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
import {
  PROPOSALS_QUERY,
  PROPOSAL_SUBSCRIPTION,
} from "../../../routes/governance";
import { ProposalsSub } from "../../../routes/governance/__generated__/proposalsSub";
import {
  Proposals,
  Proposals_proposals_terms_change_UpdateNetworkParameter,
} from "../../../routes/governance/__generated__/proposals";
import { Parties } from "../../../routes/governance/__generated__/Parties";
import { PARTIES_QUERY } from "../../../routes/governance/vote-details";
import { generateProposal } from "../../../routes/governance/test-helpers/generate-proposals";

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

const notVoted = generateProposal();
(
  notVoted.terms
    .change as Proposals_proposals_terms_change_UpdateNetworkParameter
).networkParameter.key = "not.voted";
notVoted.party.id = "123";
notVoted.votes.yes.votes = null;
notVoted.votes.no.votes = null;

const noTokens = generateProposal();
(
  noTokens.terms
    .change as Proposals_proposals_terms_change_UpdateNetworkParameter
).networkParameter.key = "no.tokens";

const votedAgainst = generateProposal();
(
  votedAgainst.terms
    .change as Proposals_proposals_terms_change_UpdateNetworkParameter
).networkParameter.key = "voted.against";
votedAgainst.party.id = "123";
votedAgainst.votes.no.votes = [
  {
    value: VoteValue.No,
    party: {
      id: "0680ffba6c2e0239ebaa2b941ee79675dd1f447ddcae37720f8f377101f46527",
      __typename: "Party",
    },
    datetime: faker.date.past().toISOString(),
    __typename: "Vote",
  },
];

const didNotVote = generateProposal();
(
  didNotVote.terms
    .change as Proposals_proposals_terms_change_UpdateNetworkParameter
).networkParameter.key = "voted.closed.did.not.vote";
didNotVote.state = ProposalState.Enacted;
didNotVote.party.id = "123";

const voteClosedVotedFor = generateProposal();
(
  voteClosedVotedFor.terms
    .change as Proposals_proposals_terms_change_UpdateNetworkParameter
).networkParameter.key = "voted.closed.voted.for";
voteClosedVotedFor.state = ProposalState.Enacted;
voteClosedVotedFor.party.id = "123";
voteClosedVotedFor.votes.yes.votes = [
  {
    value: VoteValue.Yes,
    party: {
      id: "0680ffba6c2e0239ebaa2b941ee79675dd1f447ddcae37720f8f377101f46527",
      __typename: "Party",
    },
    datetime: faker.date.past().toISOString(),
    __typename: "Vote",
  },
];

const MOCK_PROPOSALS: MockedResponse<Proposals> = {
  request: {
    query: PROPOSALS_QUERY,
  },
  result: {
    data: {
      proposals: [
        notVoted,
        noTokens,
        votedAgainst,
        didNotVote,
        voteClosedVotedFor,
      ],
    },
  },
};

const MOCK_PROPOSALS_SUBSCRIPTION: MockedResponse<ProposalsSub> = {
  request: {
    query: PROPOSAL_SUBSCRIPTION,
  },
  result: {
    data: {
      proposals: {
        id: "dab4eb13c027c82f1f2c9208aa4fe7c04413f91e5709fa4a44a4c29f4d449266",
        reference: "",
        state: ProposalState.Open,
        datetime: "2021-09-02T13:19:42.157201307Z",
        rejectionReason: null,
        party: {
          id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
          __typename: "Party",
        },
        terms: {
          closingDatetime: "2022-03-01T00:00:00Z",
          enactmentDatetime: "2022-08-30T23:00:00Z",
          change: {
            networkParameter: {
              key: "market.fee.factors.makerFee",
              value: "0.33333",
              __typename: "NetworkParameter",
            },
            __typename: "UpdateNetworkParameter",
          },
          __typename: "ProposalTerms",
        },
        votes: {
          yes: {
            totalTokens: "0",
            totalWeight: "0",
            totalNumber: "1",
            votes: [
              {
                value: VoteValue.Yes,
                party: {
                  id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
                  __typename: "Party",
                },
                datetime: "2021-09-02T13:20:23.184093701Z",
                __typename: "Vote",
              },
            ],
            __typename: "ProposalVoteSide",
          },
          no: {
            totalTokens: "0",
            totalWeight: "0",
            totalNumber: "0",
            votes: null,
            __typename: "ProposalVoteSide",
          },
          __typename: "ProposalVotes",
        },
        __typename: "Proposal",
      },
    },
  },
};

const MOCK_PARTIES: MockedResponse<Parties> = {
  request: {
    query: PARTIES_QUERY,
  },
  result: {
    data: {
      parties: [
        {
          __typename: "Party",
          id: "123",
          stake: {
            __typename: "PartyStake",
            currentStakeAvailable: "12345",
          },
        },
      ],
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
        MOCK_PROPOSALS,
        MOCK_PROPOSALS_SUBSCRIPTION,
        MOCK_PARTIES,
      ]}
    >
      {children}
    </MockedProvider>
  );
};
