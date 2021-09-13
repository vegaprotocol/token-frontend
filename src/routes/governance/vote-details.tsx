import "./vote-details.scss";
import { useTranslation } from "react-i18next";
import { useVoteInformation } from "./hooks";
import { VoteProgress } from "./vote-progress";
import { Proposals_proposals } from "./__generated__/proposals";
import { CurrentProposalStatus } from "./current-proposal-status";
import { VoteButtons } from "./vote-buttons";
import { useUserVote } from "./use-user-vote";

interface VoteDetailsProps {
  proposal: Proposals_proposals;
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

  const daysLeft = 1;
  const daysLeftText =
    daysLeft > 1
      ? `${daysLeft} ${t("GOVERNANCE.days")}`
      : `${daysLeft} ${t("GOVERNANCE.day")}`;

  return (
    <section>
      <h4 className="proposal__sub-title">{t("GOVERNANCE.votes")}</h4>
      <div>
        <p>
          {t("GOVERNANCE.setTo")}
          <span className="proposal-toast__success-text">
            <CurrentProposalStatus proposal={proposal} />
          </span>
          .&nbsp;
          {daysLeftText}
          {t("GOVERNANCE.daysLeft")}
        </p>
        <table className="proposal-toast__table">
          <thead>
            <tr>
              <th>{t("GOVERNANCE.for")}</th>
              <th style={{ width: "50%" }}>
                <VoteProgress
                  threshold={requiredMajorityPercentage}
                  progress={yesPercentage}
                />
              </th>
              <th>{t("GOVERNANCE.against")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{yesPercentage.toFixed(2)}%</td>
              <td className="proposal-toast__summary">
                {t("GOVERNANCE.majorityRequired")}{" "}
                {requiredMajorityPercentage.toFixed(2)}%
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
        {t("GOVERNANCE.participation")}
        {": "}
        {participationMet ? (
          <span className="proposal-toast__participation-met">
            {t("GOVERNANCE.met")}
          </span>
        ) : (
          <span className="proposal-toast__participation-not-met">
            {t("GOVERNANCE.notMet")}
          </span>
        )}{" "}
        {totalTokensVoted} {totalTokensPercentage}%
        <span className="proposal-toast__required-participation text-deemphasise">
          ({Number(requiredParticipation) * 100}% {t("GOVERNANCE.required")})
        </span>
      </div>
        <VoteButtons
          voteState={voteState}
          castVote={castVote}
          voteDatetime={voteDatetime}
          votePending={votePending}
        />
    </section>
  );
};
