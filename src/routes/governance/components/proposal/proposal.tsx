import { Heading } from "../../../../components/heading";
import { getProposalName } from "../../../../lib/type-policies/proposal";
import { Proposal_proposal } from "../../__generated__/Proposal";
import { ProposalChangeTable } from "../proposal-change-table";
import { ProposalTermsJson } from "../proposal-terms-json";
import { VoteDetails } from "../vote-details";

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
      <ProposalChangeTable proposal={proposal} />
      <VoteDetails proposal={proposal} />
      <ProposalTermsJson proposal={proposal} />
    </>
  );
};
