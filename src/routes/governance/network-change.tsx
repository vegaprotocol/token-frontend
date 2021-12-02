import { compareAsc, format } from "date-fns";
import { Proposals_proposals } from "./__generated__/Proposals";
import { useTranslation } from "react-i18next";
import { ProposalChangeText } from "./proposal-change-text";
import { CurrentProposalState } from "./current-proposal-state";

const DATE_FORMAT = "d MMM yyyy HH:mm";

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
    const now = new Date();

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
              {compareAsc(now, new Date(terms.closingDatetime)) > 0
                ? t("closedOn")
                : t("closesOn")}
            </th>
            <td>{format(new Date(terms.closingDatetime), DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>
              {compareAsc(now, new Date(terms.enactmentDatetime)) > 0
                ? t("enactedOn")
                : t("proposedEnactment")}
            </th>
            <td>{format(new Date(terms.enactmentDatetime), DATE_FORMAT)}</td>
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
            <td>{format(new Date(proposal.datetime), DATE_FORMAT)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
