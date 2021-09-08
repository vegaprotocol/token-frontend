import { format } from "date-fns";
import "./proposals-list.scss";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Proposals_proposals,
  Proposals_proposals_terms_change_UpdateNetworkParameter,
} from "./__generated__/proposals";
import { CurrentProposalStatus } from "./current-proposal-status";

interface ProposalsListProps {
  proposals: Proposals_proposals[];
}

export const ProposalsList = ({ proposals }: ProposalsListProps) => {
  const { t } = useTranslation();

  const filteredData = proposals.filter((row) => {
    return row.terms.change.__typename === "UpdateNetworkParameter";
  });

  if (filteredData.length === 0) {
    return <p>{t("noProposals")}</p>;
  }

  const renderRow = (row: Proposals_proposals) => {
    const enactmentDate = new Date(row.terms.enactmentDatetime).getTime();
    return (
      <li className="proposals-list__main-list-item" key={row.id}>
        <div className="proposals-list__row">
          <Link
            className="proposals-list__first-item"
            to={`governance/${row.id}`}
          >
            {
              (
                row.terms
                  .change as Proposals_proposals_terms_change_UpdateNetworkParameter
              ).networkParameter.key
            }
          </Link>
          <p className="proposals-list__item-right">
            {
              (
                row.terms
                  .change as Proposals_proposals_terms_change_UpdateNetworkParameter
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
      </li>
    );
  };

  return (
    <ul className="proposals-list__main-list">
      {filteredData.map((row) => renderRow(row))}
    </ul>
  );
};
