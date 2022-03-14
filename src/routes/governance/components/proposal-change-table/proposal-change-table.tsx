import { format, isFuture } from "date-fns";
import { useTranslation } from "react-i18next";

import { DATE_FORMAT_DETAILED } from "../../../../lib/date-formats";
import { Proposals_proposals } from "../../__generated__/Proposals";
import { CurrentProposalState } from "../../current-proposal-state";

interface ProposalChangeTableProps {
  proposal: Proposals_proposals;
}

export const ProposalChangeTable = ({ proposal }: ProposalChangeTableProps) => {
  const { t } = useTranslation();

  const terms = proposal.terms;

  return (
    <table className="proposal-table">
      <tbody>
        <tr>
          <th>{t("id")}</th>
          <td>{proposal.id}</td>
        </tr>
        <tr>
          <th>{t("reference")}</th>
          <td>{proposal.reference}</td>
        </tr>
        <tr>
          <th>{t("state")}</th>
          <td>
            <CurrentProposalState proposal={proposal} />
          </td>
        </tr>
        <tr>
          <th>
            {isFuture(new Date(terms.closingDatetime))
              ? t("closesOn")
              : t("closedOn")}
          </th>
          <td>
            {format(new Date(terms.closingDatetime), DATE_FORMAT_DETAILED)}
          </td>
        </tr>
        <tr>
          <th>
            {isFuture(new Date(terms.enactmentDatetime))
              ? t("proposedEnactment")
              : t("enactedOn")}
          </th>
          <td>
            {format(new Date(terms.enactmentDatetime), DATE_FORMAT_DETAILED)}
          </td>
        </tr>
        <tr>
          <th>{t("proposedBy")}</th>
          <td>
            <span style={{ wordBreak: "break-word" }}>{proposal.party.id}</span>
          </td>
        </tr>
        <tr>
          <th>{t("proposedOn")}</th>
          <td>{format(new Date(proposal.datetime), DATE_FORMAT_DETAILED)}</td>
        </tr>
        {proposal.rejectionReason ? (
          <tr>
            <th>{t("rejectionReason")}</th>
            <td>{proposal.rejectionReason}</td>
          </tr>
        ) : null}
        <tr>
          <th>{t("type")}</th>
          <td>{proposal.terms.change.__typename}</td>
        </tr>
      </tbody>
    </table>
  );
};
