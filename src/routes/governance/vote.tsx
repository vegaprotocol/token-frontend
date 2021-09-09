import {
  Proposals_proposals,
} from "./__generated__/proposals";

interface VoteProps {
  proposal: Proposals_proposals;
}

export const Vote = ({ proposal }: VoteProps) => {
  return <div>vote</div>;
};
