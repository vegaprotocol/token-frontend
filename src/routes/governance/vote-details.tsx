import "./vote-details.scss";
import { formatDistanceToNow } from "date-fns";
import { useVoteInformation } from "./hooks";
import { VoteProgress } from "./vote-progress";
import { CurrentProposalStatus } from "./current-proposal-status";
import { VoteButtonsContainer } from "./vote-buttons";
import { useUserVote } from "./use-user-vote";
import { ProposalState } from "../../__generated__/globalTypes";
import { Proposal_proposal } from "./__generated__/Proposal";
import { useTranslation } from "react-i18next";
import BigNumber from "bignumber.js";
import { formatNumber } from "../../lib/format-number";

interface VoteDetailsProps {
  proposal: Proposal_proposal;
}

export const VoteDetails = ({ proposal }: VoteDetailsProps) => {
  const {
    totalTokensPercentage,
    participationMet,
    totalTokensVoted,
    noPercentage,
    yesPercentage,
    yesTokens,
    noTokens,
    requiredMajorityPercentage,
    requiredParticipation,
  } = useVoteInformation({ proposal });

  const { t } = useTranslation();
  const { voteState, votePending, voteDatetime, castVote } = useUserVote(
    proposal.id,
    proposal.votes.yes.votes,
    proposal.votes.no.votes
  );

  const defaultDecimals = 2;
  const daysLeft = t("daysLeft", {
    daysLeft: formatDistanceToNow(new Date(proposal.terms.closingDatetime)),
  });

  return (
    <section>
      <h4 className="proposal__sub-title">{t("votes")}</h4>
      <div>
        <p className="proposal__set_to">
          {t("setTo")}
          <span className="vote-details__success-text">
            <CurrentProposalStatus proposal={proposal} />
          </span>
          .&nbsp;
          {proposal.state === ProposalState.Open ? daysLeft : null}
        </p>
        <table className="vote-details__table">
          <thead>
            <tr>
              <th>{t("for")}</th>
              <th>
                <VoteProgress
                  threshold={requiredMajorityPercentage}
                  progress={yesPercentage}
                />
              </th>
              <th>{t("against")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{yesPercentage.toFixed(defaultDecimals)}%</td>
              <td className="vote-details__summary">
                {t("majorityRequired")}{" "}
                {requiredMajorityPercentage.toFixed(defaultDecimals)}%
              </td>
              <td>{noPercentage.toFixed(defaultDecimals)}%</td>
            </tr>
            <tr>
              <td className="text-muted">
                {" "}
                {formatNumber(new BigNumber(yesTokens), defaultDecimals)}
              </td>
              <td></td>
              <td className="text-muted">
                {formatNumber(new BigNumber(noTokens), defaultDecimals)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {t("participation")}
        {": "}
        {participationMet ? (
          <span className="vote-details__participation-met">{t("met")}</span>
        ) : (
          <span className="vote-details__participation-not-met">
            {t("notMet")}
          </span>
        )}{" "}
        {formatNumber(new BigNumber(totalTokensVoted), defaultDecimals)}{" "}
        {formatNumber(new BigNumber(totalTokensPercentage), defaultDecimals)}%
        <span className="vote-details__required-participation text-muted">
          ({formatNumber(new BigNumber(Number(requiredParticipation) * 100), defaultDecimals)}
          % {t("governanceRequired")})
        </span>
      </div>
      <VoteButtonsContainer
        voteState={voteState}
        castVote={castVote}
        voteDatetime={voteDatetime}
        votePending={votePending}
        proposalState={proposal.state}
      />
    </section>
  );
};
