import { format } from "date-fns";
import "./proposals-list.scss";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";
import { Proposals_proposals } from "./__generated__/Proposals";
import { CurrentProposalStatus } from "./current-proposal-status";
import { Heading } from "../../components/heading";
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
        <table className="proposal-table">
          <tbody>
            <tr>
              <th>{t("status")}</th>
              <td>
                <CurrentProposalStatus proposal={row} />
              </td>
            </tr>
            <tr>
              <th>{t("closesOn")}</th>
              <td>
                {format(new Date(row.terms.closingDatetime), DATE_FORMAT)}
              </td>
            </tr>
            <tr>
              <th>{t("toEnactOn")}</th>
              <td>
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
