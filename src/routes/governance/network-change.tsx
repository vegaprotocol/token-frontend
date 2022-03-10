import { format, isFuture } from "date-fns";
import { useTranslation } from "react-i18next";

import { DATE_FORMAT_DETAILED } from "../../lib/date-formats";
import { Proposals_proposals } from "./__generated__/Proposals";
import { CurrentProposalState } from "./current-proposal-state";
import { ProposalChangeText } from "./proposal-change-text";

interface NetworkChangeProps {
  proposal: Proposals_proposals;
}

export const NetworkChange = ({ proposal }: NetworkChangeProps) => {
  const { t } = useTranslation();

  if (proposal.terms.change.__typename !== "UpdateNetworkParameter") {
    return null;
  }

  const terms = proposal.terms;
  const networkParameter = proposal.terms.change.networkParameter;

  return (
    <section>
      <p style={{ margin: "20px 0 2px 0", color: "#fff" }}>
        <ProposalChangeText networkParam={networkParameter} />
      </p>
      <table className="proposal-table">
        <tbody>
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
              <span style={{ wordBreak: "break-word" }}>
                {proposal.party.id}
              </span>
            </td>
          </tr>
          <tr>
            <th>{t("proposedOn")}</th>
            <td>{format(new Date(proposal.datetime), DATE_FORMAT_DETAILED)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
