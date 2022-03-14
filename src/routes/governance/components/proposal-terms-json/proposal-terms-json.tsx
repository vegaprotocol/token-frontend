import { SyntaxHighlighter } from "../../../../components/syntax-highlighter";
import { RestProposalResponse } from "../../proposal/proposal-container";

export const ProposalTermsJson = ({
  terms,
}: {
  terms: RestProposalResponse;
}) => {
  return (
    <section>
      <h2>Proposal Terms</h2>
      <SyntaxHighlighter data={terms} />
    </section>
  );
};
