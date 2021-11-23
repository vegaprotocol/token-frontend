import "./vote-details.scss";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { useVoteInformation } from "./hooks";
import { VoteProgress } from "./vote-progress";
import { CurrentProposalStatus } from "./current-proposal-status";
import { VoteButtonsContainer } from "./vote-buttons";
import { useUserVote } from "./use-user-vote";
import { ProposalState } from "../../__generated__/globalTypes";
import { Proposal_proposal } from "./__generated__/Proposal";

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

  const daysLeft = t("daysLeft", {
    daysLeft: formatDistanceToNow(new Date(proposal.terms.closingDatetime)),
  });

  return (
    <section>
      <h4 className="proposal__sub-title">{t("votes")}</h4>
      <div>
        <p className="proposal__set_to">
          {t("setTo")}
          <span className="proposal-toast__success-text">
            <CurrentProposalStatus proposal={proposal} />
          </span>
          .&nbsp;
          {proposal.state === ProposalState.Open ? daysLeft : null}
        </p>
        <table className="proposal-toast__table">
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
              <td>{yesPercentage.toFixed(2)}%</td>
              <td className="proposal-toast__summary">
                {t("majorityRequired")} {requiredMajorityPercentage.toFixed(2)}%
              </td>
              <td>{noPercentage.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="proposal-toast__deemphasise">{yesTokens}</td>
              <td></td>
              <td className="proposal-toast__deemphasise">{noTokens}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {t("participation")}
        {": "}
        {participationMet ? (
          <span className="proposal-toast__participation-met">{t("met")}</span>
        ) : (
          <span className="proposal-toast__participation-not-met">
            {t("notMet")}
          </span>
        )}{" "}
        {totalTokensVoted} {totalTokensPercentage}%
        <span className="proposal-toast__required-participation text-deemphasise">
          ({Number(requiredParticipation) * 100}% {t("governanceRequired")})
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
