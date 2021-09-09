import "./vote-details.scss";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { useVoteInformation } from "./hooks";
import { VoteProgress } from "./vote-progress";
import { Proposals_proposals } from "./__generated__/proposals";

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

  return (
    <section>
      <h4 className="proposal__sub-title">{t("votes")}</h4>
      <div>
        <table className="proposal-toast__table">
          <thead>
            <tr>
              <th style={{ width: "25%", color: Colors.GREEN }}>
                {t("GOVERNANCE.for")}
              </th>
              <th style={{ width: "50%" }}>
                <VoteProgress
                  threshold={requiredMajorityPercentage}
                  progress={yesPercentage}
                />
              </th>
              <th style={{ width: "25%", color: Colors.RED }}>
                {t("GOVERNANCE.against")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: Colors.WHITE }}>
                {yesPercentage.toFixed(2)}%
              </td>
              <td style={{ textAlign: "center", color: Colors.WHITE }}>
                {t("GOVERNANCE.majorityRequired")}{" "}
                {requiredMajorityPercentage.toFixed(2)}%
              </td>
              <td style={{ color: Colors.WHITE }}>
                {noPercentage.toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td>{yesTokens}</td>
              <td></td>
              <td>{noTokens}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {t("GOVERNANCE.participation")}
        {": "}
        {participationMet ? (
          <span style={{ color: Colors.GREEN, marginRight: 5, marginLeft: 5 }}>
            {t("GOVERNANCE.met")}
          </span>
        ) : (
          <span style={{ color: Colors.RED, marginRight: 5, marginLeft: 5 }}>
            {t("GOVERNANCE.notMet")}
          </span>
        )}{" "}
        {totalTokensVoted} {totalTokensPercentage}%
        <span style={{ marginLeft: 5 }} className="text-deemphasise">
          ({Number(requiredParticipation) * 100}% {t("GOVERNANCE.required")})
        </span>
      </div>
    </section>
  );
};
