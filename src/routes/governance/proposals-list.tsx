import { format } from "date-fns";
import "./proposals-list.scss";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { proposals_proposals } from "./_temp_/proposals";
import { CurrentProposalStatus } from "./current-proposal-status";

interface ProposalsListProps {
  data: proposals_proposals[];
}

export const ProposalsList = ({ data }: ProposalsListProps) => {
  const renderRow = (row: proposals_proposals) => {
    if (row.terms.change.__typename !== "UpdateNetworkParameter") {
      return null;
    }

    const enactmentDate = new Date(row.terms.enactmentDatetime).getTime()
    return (
      <div key={row.id}>
        <div className="proposals-list__row">
          <Link className="proposals-list__first-item" to={"/test"}>
            {row.terms.change.networkParameter.key}
          </Link>
          <p className="proposals-list__item-right">
            {row.terms.change.networkParameter.value}
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
          <p className="proposals-list__item-left-low-key">
            {t("voteStatus")}
          </p>
          <CurrentProposalStatus proposal={row} />
        </div>
      </div>
    );
  };

  const { t } = useTranslation();
  return <div>{data.map((row) => renderRow(row))}</div>;
};
