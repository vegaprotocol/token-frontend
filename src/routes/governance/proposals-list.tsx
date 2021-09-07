import { format } from "date-fns";
import "./proposals-list.scss";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { proposals_proposals, proposals_proposals_terms_change_UpdateNetworkParameter } from "./__generated__/proposals";
import { CurrentProposalStatus } from "./current-proposal-status";

interface ProposalsListProps {
  data: proposals_proposals[];
}

export const ProposalsList = ({ data }: ProposalsListProps) => {
  const { t } = useTranslation();

  const filteredData = data.filter(row => {
    return row.terms.change.__typename === "UpdateNetworkParameter"
  })

  if (filteredData.length === 0) {
    return <p>{t("noProposals")}</p>;
  }

  const renderRow = (row: proposals_proposals) => {

    const enactmentDate = new Date(row.terms.enactmentDatetime).getTime();
    return (
      <div key={row.id}>
        <div className="proposals-list__row">
          <Link className="proposals-list__first-item" to={"/test"}>
            {(
              row.terms
                .change as proposals_proposals_terms_change_UpdateNetworkParameter
            ).networkParameter.key}
          </Link>
          <p className="proposals-list__item-right">
            {
              (
                row.terms
                  .change as proposals_proposals_terms_change_UpdateNetworkParameter
              ).networkParameter!.value
            }
          </p>
        </div>
        <div className="proposals-list__row">
          <p className="proposals-list__item-left-low-key">
            {t("Proposed enactment")}
          </p>
          <span className="proposals-list__item-right">
            {format(enactmentDate, "d MMM yyyy")}
          </span>
        </div>

        <div className="proposals-list__row proposals-list__border">
          <p className="proposals-list__item-left-low-key">{t("voteStatus")}</p>
          <CurrentProposalStatus proposal={row} />
        </div>
      </div>
    );
  };

  return <div>{filteredData.map((row) => renderRow(row))}</div>;
};
