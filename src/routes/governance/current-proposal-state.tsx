import { Proposals_proposals } from "./__generated__/Proposals";
import "./current-proposal-state.scss";
import { ProposalState } from "../../__generated__/globalTypes";

export const CurrentProposalState = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const { state } = proposal;
  let className = "current-proposal-state__open";

  if (
    state === ProposalState.Declined ||
    state === ProposalState.Failed ||
    state === ProposalState.Rejected
  ) {
    className = "current-proposal-state__fail";
  } else if (
    state === ProposalState.Enacted ||
    state === ProposalState.Passed
  ) {
    className = "current-proposal-state__pass";
  }
  return <span className={className}>{state}</span>;
};
