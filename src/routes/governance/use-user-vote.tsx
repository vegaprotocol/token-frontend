import { captureException } from "@sentry/minimal";
import * as React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import {
  hasErrorProperty,
  VoteSubmissionInput,
} from "../../lib/vega-wallet/vega-wallet-service";
import { VoteValue } from "../../__generated__/globalTypes";
import { VOTE_VALUE_MAP } from "./vote-types";
import { gql, useApolloClient } from "@apollo/client";

export const VOTES_SUBSCRIPTION_QUERY = gql`
  subscription votesSub($partyId: ID!) {
    busEvents(types: [Vote], batchSize: 0, partyId: $partyId) {
      type
      event {
        ... on Vote {
          datetime
          value
          party {
            id
          }
        }
      }
    }
  }
`;

export type Vote = {
  value: VoteValue;
  datetime: string;
  party: { id: string };
};

export type Votes = Array<Vote | null>;

export enum VoteState {
  NotCast = "NotCast",
  Yes = "Yes",
  No = "No",
  Failed = "Failed",
}

export function getMyVote(pubkey: string, yesVotes?: Votes, noVotes?: Votes) {
  const myYes = yesVotes?.find((v) => v && v.party.id === pubkey);
  const myNo = noVotes?.find((v) => v && v.party.id === pubkey);
  if (myYes) {
    return myYes;
  } else if (myNo) {
    return myNo;
  } else {
    return null;
  }
}

export function useUserVote(
  proposalId: string | null,
  yesVotes: Votes | null,
  noVotes: Votes | null
) {
  const yes = React.useMemo(() => yesVotes || [], [yesVotes]);
  const no = React.useMemo(() => noVotes || [], [noVotes]);
  const client = useApolloClient();
  const {
    appState: { currVegaKey },
  } = useAppState();
  const vegaWallet = useVegaWallet();
  const subRef = React.useRef<any>(null);
  const [votePending, setVotePending] = React.useState(false);

  const myVote = React.useMemo(() => {
    if (currVegaKey) return getMyVote(currVegaKey.pub, yes, no);
  }, [currVegaKey, yes, no]);

  const initialState = React.useMemo(() => {
    if (myVote === null || myVote === undefined) {
      return VoteState.NotCast;
    } else {
      return myVote.value === VoteValue.Yes ? VoteState.Yes : VoteState.No;
    }
  }, [myVote]);

  const [voteState, setVoteState] = React.useState(initialState);

  async function castVote(value: VoteValue) {
    if (!proposalId || !currVegaKey) return;

    setVotePending(true);
    setVoteState(value === VoteValue.Yes ? VoteState.Yes : VoteState.No);

    try {
      const variables: VoteSubmissionInput = {
        pubKey: currVegaKey.pub,
        voteSubmission: {
          value: VOTE_VALUE_MAP[value],
          proposalId,
        },
      };
      const res = await vegaWallet.commandSync(variables);

      if (hasErrorProperty(res)) {
        throw new Error(res.error);
      }
    } catch (err) {
      setVoteState(VoteState.Failed);
      captureException(err);
    }

    // start a subscription to see if your vote passes consensus
    subRef.current = client
      .subscribe({
        query: VOTES_SUBSCRIPTION_QUERY,
        variables: { partyId: currVegaKey.pub },
      })
      .subscribe({
        next: ({ data }) => {
          const userVote = data.busEvents.find((e: any) => {
            if (e.type === "Vote" && e.event.party.id === currVegaKey.pub) {
              return true;
            }

            return false;
          });

          if (userVote) {
            setVotePending(false);
          }
        },
        error: (err) => {
          captureException(err);
          // kill the subscription if an error is returned
          subRef.current.unsubscribe();
        },
      });
  }

  // if the component unmounts and there is still a subscription running
  // cancel it so its not left hanging around
  React.useEffect(() => {
    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
    };
  }, []);

  return {
    voteState,
    votePending,
    castVote,
    myVote,
    voteDatetime: myVote ? myVote.datetime : null,
  };
}
