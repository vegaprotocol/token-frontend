import { useParams } from "react-router";
import { Proposals_proposals, Proposals_proposals_terms_change_UpdateNetworkParameter } from "./__generated__/proposals";

interface ProposalProps {
  proposals: Proposals_proposals[];
}

export const Proposal = ({ proposals }: ProposalProps) => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposal = proposals.find(proposal => proposal.id === proposalId)
  console.log(proposal)
  if (!proposal) {
    return <div>err</div>
  }
  const { terms } = proposal
  const networkParameter = (terms
              .change as Proposals_proposals_terms_change_UpdateNetworkParameter
          ).networkParameter

  return (
    <div>
      <h1>New Net</h1>
      <h4>Net Ch</h4>
      <h4>{networkParameter.key}</h4>
      <p>Proposed new value {networkParameter.value}</p>
      <p>To enact on {terms.enactmentDatetime}</p>
      <p>Proposed by {proposal.party.id}</p>
      <p>Proposed on {proposal.datetime}</p>
    </div>
  );
};
