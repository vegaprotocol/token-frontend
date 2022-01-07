import "./proposals-list.scss";

import { format, isFuture } from "date-fns";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";

import { Heading } from "../../components/heading";
import { Proposals_proposals } from "./__generated__/Proposals";
import { CurrentProposalState } from "./current-proposal-state";
import { ProposalChangeText } from "./proposal-change-text";

const DATE_FORMAT = "d MMM yyyy HH:mm";

interface ProposalsListProps {
  proposals: Proposals_proposals[];
}

export const ProposalsList = ({ proposals }: ProposalsListProps) => {
  const { t } = useTranslation();
  const match = useRouteMatch();

  const filteredData = proposals.filter((row) => {
    return row.terms.change.__typename === "UpdateNetworkParameter";
  });

  if (filteredData.length === 0) {
    return <p>{t("noProposals")}</p>;
  }

  const renderRow = (row: Proposals_proposals) => {
    if (row.terms.change.__typename !== "UpdateNetworkParameter") return null;

    const type = row.terms.change.__typename;

    return (
      <li key={row.id}>
        <Link to={`${match.url}/${row.id}`}>
          <header className="proposals-list__item-header">
            <p className="proposals-list__item-type">{type}</p>
            <p className="proposals-list__item-change">
              <ProposalChangeText
                networkParam={row.terms.change.networkParameter}
              />
            </p>
          </header>
        </Link>
        <table
          className="proposal-table"
          data-testid="governance-proposal-table"
        >
          <tbody>
            <tr>
              <th>{t("state")}</th>
              <td data-testid="governance-proposal-state">
                <CurrentProposalState proposal={row} />
              </td>
            </tr>
            <tr>
              <th>
                {isFuture(new Date(row.terms.closingDatetime))
                  ? t("closesOn")
                  : t("closedOn")}
              </th>
              <td data-testid="governance-proposal-closingDate">
                {format(new Date(row.terms.closingDatetime), DATE_FORMAT)}
              </td>
            </tr>
            <tr>
              <th>
                {isFuture(new Date(row.terms.enactmentDatetime))
                  ? t("proposedEnactment")
                  : t("enactedOn")}
              </th>
              <td data-testid="governance-proposal-enactmentDate">
                {format(new Date(row.terms.enactmentDatetime), DATE_FORMAT)}
              </td>
            </tr>
          </tbody>
        </table>
      </li>
    );
  };

  return (
    <>
      <Heading title={t("pageTitleGovernance")} />
      <p>{t("proposedChangesToVegaNetwork")}</p>
      <p>{t("vegaTokenHoldersCanVote")}</p>
      <p>{t("requiredMajorityDescription")}</p>
      <h2>{t("proposals")}</h2>
      <ul className="proposals-list">
        {filteredData.map((row) => renderRow(row))}
      </ul>
    </>
  );
};
