import "./current-proposal-status.scss";

import { useTranslation } from "react-i18next";
import { useVoteInformation } from "./hooks";
import { Proposals_proposals } from "./__generated__/proposals";
import { ProposalState } from "../../__generated__/globalTypes";

export const CurrentProposalStatus = ({
  proposal,
}: {
  proposal: Proposals_proposals;
}) => {
  const { willPass, majorityMet, participationMet } = useVoteInformation({
    proposal,
  });
  const { t } = useTranslation();

  if (willPass) {
    return (
      <span className="current-proposal-status__pass">{t("shouldPass")}</span>
    );
  }

  if (!participationMet) {
    return (
      <span className="current-proposal-status__fail">
        {t("participationNotMet")}
      </span>
    );
  }

  if (!majorityMet) {
    return (
      <span className="current-proposal-status__fail">
        {t("majorityNotMet")}
      </span>
    );
  }

  if (proposal.state === ProposalState.Failed) {
    return <span className="current-proposal-status__fail">{t("failed")}</span>;
  }

  if (proposal.state === ProposalState.Passed) {
    return <span className="current-proposal-status__pass">{t("passed")}</span>;
  }

  return <span>Unknown</span>;
};
