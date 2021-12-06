import React from "react";

import type { Proposals_proposals } from "./__generated__/Proposals";
import { useNetworkParam } from "../../hooks/use-network-param";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { NetworkParams } from "../../config";
import {
  Proposal_proposal_votes_no_votes,
  Proposal_proposal_votes_yes_votes,
} from "./__generated__/Proposal";
import { addDecimal } from "../../lib/decimals";
import BigNumber from "bignumber.js";

const useProposalNetworkParams = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const { data, loading } = useNetworkParam([
    NetworkParams.GOV_UPDATE_MARKET_REQUIRED_MAJORITY,
    NetworkParams.GOV_UPDATE_MARKET_REQUIRED_PARTICIPATION,
    NetworkParams.GOV_NEW_MARKET_REQUIRED_MAJORITY,
    NetworkParams.GOV_NEW_MARKET_REQUIRED_PARTICIPATION,
    NetworkParams.GOV_ASSET_REQUIRED_MAJORITY,
    NetworkParams.GOV_ASSET_REQUIRED_PARTICIPATION,
    NetworkParams.GOV_UPDATE_NET_PARAM_REQUIRED_MAJORITY,
    NetworkParams.GOV_UPDATE_NET_PARAM_REQUIRED_PARTICIPATION,
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

  const noTokens = React.useMemo(() => {
    if (!proposal.votes.no.votes) {
      return 0;
    }
    const totalNoVotes = proposal.votes.no.votes.reduce(
      (prevValue: number, newValue: Proposal_proposal_votes_no_votes) => {
        return prevValue + Number(newValue.party.stake.currentStakeAvailable);
      },
      0
    );
    return Number(addDecimal(new BigNumber(totalNoVotes), 18));
  }, [proposal.votes.no.votes]);

  const yesTokens = React.useMemo(() => {
    if (!proposal.votes.yes.votes) {
      return 0;
    }
    const totalYesVotes = proposal.votes.yes.votes.reduce(
      (prevValue: number, newValue: Proposal_proposal_votes_yes_votes) => {
        return prevValue + Number(newValue.party.stake.currentStakeAvailable);
      },
      0
    );
    return Number(addDecimal(new BigNumber(totalYesVotes), 18));
  }, [proposal.votes.yes.votes]);

  const totalTokensVoted = React.useMemo(
    () => Number(yesTokens) + Number(noTokens),
    [yesTokens, noTokens]
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
