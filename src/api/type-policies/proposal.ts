import type { TypePolicy } from '@apollo/client'

import type {
  proposals_proposals_terms,
  proposals_proposals_terms_change
} from '../vega-graphql'

const typePolicy: TypePolicy = {
  fields: {
    name: {
      read(name, { readField }) {
        if (name) {
          return name
        }
        const terms = readField<proposals_proposals_terms>('terms')
        if (!terms) {
          return "Unknown proposal"
        }
        return getProposalName(terms.change)
      }
    },
    pending: {
      read(isPending = false) {
        return isPending
      }
    }
  }
}

export const proposalTypePolicy = {
  Proposal: typePolicy
}

export function getProposalName(change: proposals_proposals_terms_change) {
  if (change.__typename === 'NewAsset') {
    return `New asset: ${change.symbol}`;
  } else if (change.__typename === 'NewMarket') {
    return `New Market: ${change.instrument.name}`
  } else if (change.__typename === 'UpdateMarket') {
    return `Update Market: ${change.marketId}`
  } else if (change.__typename === 'UpdateNetworkParameter') {
    return `Update Network: ${change.networkParameter.key}`
  }

  return "Unknown Proposal"
}
