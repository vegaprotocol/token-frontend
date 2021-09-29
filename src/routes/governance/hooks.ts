import React from "react";

import type { Proposals_proposals } from "./__generated__/proposals";
import { useNetworkParam } from "../../hooks/use-network-param";
import { useAppState } from "../../contexts/app-state/app-state-context";

const useProposalNetworkParams = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const { data, loading } = useNetworkParam([
    "governance.proposal.updateMarket.requiredMajority",
    "governance.proposal.updateMarket.requiredParticipation",
    "governance.proposal.market.requiredMajority",
    "governance.proposal.market.requiredParticipation",
    "governance.proposal.asset.requiredMajority",
    "governance.proposal.asset.requiredParticipation",
    "governance.proposal.updateNetParam.requiredMajority",
    "governance.proposal.updateNetParam.requiredParticipation",
  ]);
  if (loading || !data) {
    return {
      requiredMajority: 100,
      requiredParticipation: 100,
    };
  }

  const [
    updateMarketMajority,
    updateMarketParticipation,
    newMarketMajority,
    newMarketParticipation,
    assetMajority,
    assetParticipation,
    paramMajority,
    paramParticipation,
  ] = data;

  switch (proposal.terms.change.__typename) {
    case "UpdateMarket":
      return {
        requiredMajority: updateMarketMajority,
        requiredParticipation: updateMarketParticipation,
      };
    case "UpdateNetworkParameter":
      return {
        requiredMajority: paramMajority,
        requiredParticipation: paramParticipation,
      };
    case "NewAsset":
      return {
        requiredMajority: assetMajority,
        requiredParticipation: assetParticipation,
      };
    case "NewMarket":
      return {
        requiredMajority: newMarketMajority,
        requiredParticipation: newMarketParticipation,
      };
  }
};

export const useVoteInformation = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const {
    appState: { totalSupply },
  } = useAppState();
  const { requiredMajority, requiredParticipation } = useProposalNetworkParams({
    proposal,
  });

  const requiredMajorityPercentage = React.useMemo(
    () => (requiredMajority ? Number(requiredMajority) * 100 : 100),
    [requiredMajority]
  );
  const yesTokens = React.useMemo(
    () => Number(proposal.votes.yes.totalTokens),
    [proposal.votes.yes.totalTokens]
  );
  const noTokens = React.useMemo(
    () => Number(proposal.votes.no.totalTokens),
    [proposal.votes.no.totalTokens]
  );
  const totalTokensVoted = React.useMemo(
    () => yesTokens + noTokens,
    [noTokens, yesTokens]
  );
  const yesPercentage = React.useMemo(
    () => (totalTokensVoted === 0 ? 0 : (yesTokens * 100) / totalTokensVoted),
    [totalTokensVoted, yesTokens]
  );
  const noPercentage = React.useMemo(
    () => (totalTokensVoted === 0 ? 0 : (noTokens * 100) / totalTokensVoted),
    [noTokens, totalTokensVoted]
  );
  const participationMet = React.useMemo(() => {
    const tokensNeeded = +totalSupply * Number(requiredParticipation);
    return totalTokensVoted > tokensNeeded;
  }, [requiredParticipation, totalTokensVoted, totalSupply]);

  const majorityMet = React.useMemo(() => {
    return totalTokensVoted >= requiredMajority;
  }, [requiredMajority, totalTokensVoted]);

  const totalTokensPercentage = React.useMemo(() => {
    return Number((100 * totalTokensVoted) / +totalSupply).toFixed(4);
  }, [totalTokensVoted, totalSupply]);

  const willPass = React.useMemo(
    () => participationMet && yesPercentage > requiredMajorityPercentage,
    [participationMet, requiredMajorityPercentage, yesPercentage]
  );
  return {
    willPass,
    totalTokensPercentage,
    participationMet,
    totalTokensVoted,
    noPercentage,
    yesPercentage,
    noTokens,
    yesTokens,
    requiredMajorityPercentage,
    requiredParticipation,
    majorityMet,
  };
};
