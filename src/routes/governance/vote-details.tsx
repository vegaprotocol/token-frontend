import { VoteButtonsContainer } from "./vote-buttons";
import { useUserVote } from "./use-user-vote";
import { Proposal_proposal } from "./__generated__/Proposal";

interface VoteDetailsProps {
  proposal: Proposal_proposal;
}

export const VoteDetails = ({ proposal }: VoteDetailsProps) => {
  const { voteState, votePending, voteDatetime, castVote } = useUserVote(
    proposal.id,
    proposal.votes.yes.votes,
    proposal.votes.no.votes
  );

  return (
    <VoteButtonsContainer
      voteState={voteState}
      castVote={castVote}
      voteDatetime={voteDatetime}
      votePending={votePending}
      proposalState={proposal.state}
    />
  );
};
