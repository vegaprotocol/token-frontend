import { Proposal_proposal } from "./__generated__/Proposal";

export const ProposalTermsJson = ({
  proposal,
}: {
  proposal: Proposal_proposal;
}) => {
  return (
    <section>
      <h2>Proposal Terms</h2>
      <pre>{JSON.stringify(proposal.terms.change, null, "  ")}</pre>
    </section>
  );
};
