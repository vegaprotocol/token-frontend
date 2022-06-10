import "./proposals-list.scss";

import { format, isFuture } from "date-fns";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";

import { Heading } from "../../../../components/heading";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../../components/key-value-table";
import { DATE_FORMAT_DETAILED } from "../../../../lib/date-formats";
import { getProposalName } from "../../../../lib/type-policies/proposal";
import { Proposals_proposals } from "../../proposals/__generated__/Proposals";
import { CurrentProposalState } from "../current-proposal-state";

interface ProposalsListProps {
  proposals: Proposals_proposals[];
}

export const ProposalsList = ({ proposals }: ProposalsListProps) => {
  const { t } = useTranslation();
  const match = useRouteMatch();

  if (proposals.length === 0) {
    return <p>{t("noProposals")}</p>;
  }

  const renderRow = (proposal: Proposals_proposals) => {
    const closingDate = new Date(proposal.terms.closingDatetime);
    const enactmentDatetime = new Date(proposal.terms.enactmentDatetime);
    const closingValid = closingDate.toString() !== "Invalid Date";
    const enactmentValid = enactmentDatetime.toString() !== "Invalid Date";
    return (
      <li key={proposal.id}>
        <Link to={`${match.url}/${proposal.id}`}>
          <header className="proposals-list__item-header">
            <p className="proposals-list__item-change">
              {getProposalName(proposal)}
            </p>
          </header>
        </Link>
        <KeyValueTable muted={true}>
          <KeyValueTableRow>
            <th>{t("state")}</th>
            <td data-testid="governance-proposal-state">
              <CurrentProposalState proposal={proposal} />
            </td>
          </KeyValueTableRow>
          <KeyValueTableRow>
            <th>
              {closingValid
                ? isFuture(closingDate)
                  ? t("closesOn")
                  : t("closedOn")
                : t("invalidDate")}
            </th>
            <td data-testid="governance-proposal-closingDate">
              {closingValid
                ? format(closingDate, DATE_FORMAT_DETAILED)
                : t("invalidDate")}
            </td>
          </KeyValueTableRow>
          <KeyValueTableRow>
            <th>
              {enactmentValid
                ? isFuture(enactmentDatetime)
                  ? t("enactmentDatetime")
                  : t("enactedOn")
                : t("invalidDate")}
            </th>
            <td data-testid="governance-proposal-enactmentDate">
              {enactmentValid
                ? format(enactmentDatetime, DATE_FORMAT_DETAILED)
                : t("invalidDate")}
            </td>
          </KeyValueTableRow>
        </KeyValueTable>
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
        {proposals.map((row) => renderRow(row))}
      </ul>
    </>
  );
};
