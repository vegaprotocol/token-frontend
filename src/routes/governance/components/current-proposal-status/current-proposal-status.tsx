import "./current-proposal-status.scss";

import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

import { ProposalState } from "../../../../__generated__/globalTypes";
import { useVoteInformation } from "../../hooks";
import { Proposals_proposals } from "../../proposals/__generated__/Proposals";

export const CurrentProposalStatus = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const { willPass, majorityMet, participationMet } = useVoteInformation({
    proposal,
  });
  const { t } = useTranslation();
  const closingDate = new Date(proposal.terms.closingDatetime);
  const enactmentDatetime = new Date(proposal.terms.enactmentDatetime);
  const daysClosedAgo =
    closingDate.toString() === "Invalid Date"
      ? closingDate.toString()
      : formatDistanceToNow(closingDate, { addSuffix: true });

  const daysEnactedAgo =
    enactmentDatetime.toString() === "Invalid Date"
      ? enactmentDatetime.toString()
      : formatDistanceToNow(enactmentDatetime, { addSuffix: true });

  if (proposal.state === ProposalState.Open && willPass) {
    return (
      <span className="current-proposal-status__pass">{t("shouldPass")}</span>
    );
  }

  if (!participationMet) {
    return (
      <>
        <span>{t("voteFailedReason")}</span>
        <span className="current-proposal-status__fail">
          {t("participationNotMet")}
        </span>
        <span>&nbsp;{daysClosedAgo}.</span>
      </>
    );
  }

  if (!majorityMet) {
    return (
      <>
        <span>{t("voteFailedReason")}</span>
        <span className="current-proposal-status__fail">
          {t("majorityNotMet")}
        </span>
        <span>&nbsp;{daysClosedAgo}.</span>
      </>
    );
  }

  if (
    proposal.state === ProposalState.Failed ||
    proposal.state === ProposalState.Declined ||
    proposal.state === ProposalState.Rejected
  ) {
    return (
      <>
        <span>{t("voteFailedReason")}</span>
        <span className="current-proposal-status__fail">{proposal.state}</span>
        <span>&nbsp;{daysClosedAgo}.</span>
      </>
    );
  }
  if (
    proposal.state === ProposalState.Enacted ||
    proposal.state === ProposalState.Passed
  ) {
    return (
      <>
        <span>{t("votePassed")}</span>
        <span className="current-proposal-status__pass">
          &nbsp;{proposal.state}
        </span>
        <span>
          &nbsp;
          {proposal.state === ProposalState.Enacted
            ? daysEnactedAgo
            : daysClosedAgo}
          .
        </span>
      </>
    );
  }

  if (proposal.state === ProposalState.WaitingForNodeVote) {
    return (
      <span>{t("subjectToFurtherActions", { daysAgo: daysClosedAgo })}</span>
    );
  }

  return null;
};
