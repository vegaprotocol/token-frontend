import { useTranslation } from "react-i18next";
import { useVoteInformation } from "./hooks";
import { proposals_proposals } from "./_temp_/proposals";

export const CurrentProposalStatus = ({
  proposal,
}: {
  proposal: proposals_proposals;
}) => {
  const { willPass } = useVoteInformation({ proposal });
  const { t } = useTranslation()
  return (
    <span>
      {willPass ? (
        <span style={{ color: "green" }}>{t("shouldPass")}</span>
      ) : (
        <span style={{ color: "red" }}>{t("shouldPass")}</span>
      )}
    </span>
  );
};
