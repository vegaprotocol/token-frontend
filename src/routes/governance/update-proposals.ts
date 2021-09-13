import compact from 'lodash/compact'
import uniqWith from 'lodash/uniqWith'
import type { Proposals } from './__generated__/proposals'
import type { ProposalsSub } from './__generated__/proposalsSub'

import { uniqOptimisticItem } from './uniq-optimistic-item'

export function updateProposals(
  prev: Proposals,
  { subscriptionData }: { subscriptionData: { data: ProposalsSub } }
) {
  if (!prev || !subscriptionData.data?.proposals) {
    return prev
  }

  if (!prev.proposals) {
    return {
      proposals: [subscriptionData.data.proposals]
    }
  }

  const proposal = subscriptionData.data.proposals

  const proposals = uniqWith(
    compact([proposal, ...prev.proposals]),
    // @ts-ignore
    (a: proposals_proposals, b: proposals_proposals) => uniqOptimisticItem(a, b)
  )

  return {
    ...prev,
    proposals
  }
}
