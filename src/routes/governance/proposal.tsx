import "./proposal.scss";

import { useParams } from "react-router";
import { Proposals_proposals } from "./__generated__/Proposals";
import { NetworkChange } from "./network-change";
import { VoteDetails } from "./vote-details";

interface ProposalProps {
  proposals: Proposals_proposals[];
}

export const Proposal = ({ proposals }: ProposalProps) => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposal = proposals.find((proposal) => proposal.id === proposalId);

  if (!proposal) {
    return null;
  }

  return (
    <div>
      <NetworkChange proposal={proposal} />
      <VoteDetails proposal={proposal} />
    </div>
  );
};
