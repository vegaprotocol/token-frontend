import { Proposals_proposals } from "../../routes/governance/proposals/__generated__/Proposals";

export function getProposalName(proposal: Proposals_proposals) {
  if (proposal.terms.change.__typename === "NewAsset") {
    return `New Asset: ${proposal.terms.change.symbol}`;
  } else if (proposal.terms.change.__typename === "NewMarket") {
    return `New Market: ${proposal.terms.change.instrument.name}`;
  } else if (proposal.terms.change.__typename === "UpdateMarket") {
    return `Update Market: ${proposal.terms.change.marketId}`;
  } else if (proposal.terms.change.__typename === "UpdateNetworkParameter") {
    return `Update Network: ${proposal.terms.change.networkParameter.key}`;
  } else if (proposal.terms.change.__typename === "NewFreeform") {
    return `Freeform: ${proposal.terms.change.hash}`;
  }

  return "Unknown Proposal";
}
