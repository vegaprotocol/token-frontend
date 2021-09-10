import type { TypePolicy } from "@apollo/client";
import {
  Proposals_proposals_terms_change,
} from "../../routes/governance/__generated__/proposals";

const typePolicy: TypePolicy = {
  fields: {
  },
};

export const proposalTypePolicy = {
  Proposal: typePolicy,
};

export function getProposalName(change: Proposals_proposals_terms_change) {
  if (change.__typename === "NewAsset") {
    return `New asset: ${change.symbol}`;
  } else if (change.__typename === "NewMarket") {
    return `New Market: ${change.instrument.name}`;
  } else if (change.__typename === "UpdateMarket") {
    return `Update Market: ${change.marketId}`;
  } else if (change.__typename === "UpdateNetworkParameter") {
    return `Update Network: ${change.networkParameter.key}`;
  }

  return "Unknown Proposal";
}
