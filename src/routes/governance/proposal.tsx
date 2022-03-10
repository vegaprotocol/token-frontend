import { Heading } from "../../components/heading";
import { getProposalName } from "../../lib/type-policies/proposal";
import { Proposal_proposal } from "./__generated__/Proposal";
import { NetworkChange } from "./network-change";
import { ProposalTermsJson } from "./proposal-terms-json";
import { VoteDetails } from "./vote-details";

interface ProposalProps {
  proposal: Proposal_proposal;
}

export const Proposal = ({ proposal }: ProposalProps) => {
  if (!proposal) {
    return null;
  }

  return (
    <>
      <Heading title={getProposalName(proposal.terms.change)} />
      <NetworkChange proposal={proposal} />
      <VoteDetails proposal={proposal} />
      <ProposalTermsJson proposal={proposal} />
    </>
  );
};
