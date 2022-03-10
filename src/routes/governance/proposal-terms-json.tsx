import { SyntaxHighlighter } from "../../components/syntax-highlighter";
import { Proposal_proposal } from "./__generated__/Proposal";

export const ProposalTermsJson = ({
  proposal,
}: {
  proposal: Proposal_proposal;
}) => {
  return (
    <section>
      <h2>Proposal Terms</h2>
      <SyntaxHighlighter data={proposal.terms.change} />
    </section>
  );
};
