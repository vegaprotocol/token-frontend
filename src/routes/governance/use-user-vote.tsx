import { captureException } from "@sentry/minimal";
import * as React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import {
  hasErrorProperty,
  vegaWalletService,
  VoteSubmissionInput,
} from "../../lib/vega-wallet/vega-wallet-service";
import { VoteValue } from "../../__generated__/globalTypes";
import { VOTE_VALUE_MAP } from "./vote-types";

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
  const {
    appState: { currVegaKey },
  } = useAppState();
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

    try {
      const variables: VoteSubmissionInput = {
        pubKey: currVegaKey.pub,
        voteSubmission: {
          value: VOTE_VALUE_MAP[value],
          proposalId,
        },
      };
      const res = await vegaWalletService.commandSync(variables);

      if (hasErrorProperty(res)) {
        throw new Error(res.error);
      } else {
        setVotePending(false);
        setVoteState(value === VoteValue.Yes ? VoteState.Yes : VoteState.No);
      }
    } catch (err) {
      setVotePending(false);
      setVoteState(VoteState.Failed);
      captureException(err);
    }
  }

  return {
    voteState,
    votePending,
    castVote,
    myVote,
    voteDatetime: myVote ? myVote.datetime : null,
  };
}
