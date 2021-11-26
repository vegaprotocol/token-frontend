import merge from "lodash/merge";
import * as faker from "faker";

import { Proposals_proposals } from "../__generated__/Proposals";
import { ProposalState, VoteValue } from "../../../__generated__/globalTypes";

export function generateProposal(
  override?: Partial<Proposals_proposals>
): Proposals_proposals {
  const defaultProposal = {
    __typename: "Proposal",
    id: faker.datatype.uuid(),
    reference: "ref" + faker.datatype.uuid(),
    state: ProposalState.Open,
    datetime: faker.date.past().toISOString(),
    rejectionReason: null,
    party: {
      __typename: "Party",
      id: faker.datatype.uuid(),
    },
    terms: {
      __typename: "ProposalTerms",
      closingDatetime: faker.date.soon().toISOString(),
      enactmentDatetime: faker.date.future().toISOString(),
      change: {
        networkParameter: {
          key: faker.lorem.words(),
          value: faker.datatype.number({ min: 0, max: 100 }),
          __typename: "NetworkParameter",
        },
        __typename: "UpdateNetworkParameter",
      },
    },
    votes: {
      __typename: "ProposalVotes",
      yes: {
        totalTokens: "0",
        totalNumber: "1",
        votes: [
          {
            value: VoteValue.Yes,
            party: {
              id: faker.datatype.uuid(),
              __typename: "Party",
              stake: {
                __typename: "PartyStake",
                currentStakeAvailable: "123",
              },
            },
            datetime: faker.date.past().toISOString(),
            __typename: "Vote",
          },
        ],
        __typename: "ProposalVoteSide",
      },
      no: {
        totalTokens: "0",
        totalNumber: "0",
        __typename: "ProposalVoteSide",
        votes: null,
      },
    },
  };
  return merge(defaultProposal, override);
}
