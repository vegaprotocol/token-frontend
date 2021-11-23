import { format } from "date-fns";
import { Proposals_proposals } from "./__generated__/Proposals";
import { useTranslation } from "react-i18next";
import { ProposalChangeText } from "./proposal-change-text";

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

  return (
    <section>
      <p style={{ margin: "20px 0 2px 0", color: "#fff" }}>
        <ProposalChangeText networkParam={networkParameter} />
      </p>
      <table className="proposal-table">
        <tbody>
          <tr>
            <th>{t("closesOn")}</th>
            <td>{format(new Date(terms.closingDatetime), DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>{t("toEnactOn")}</th>
            <td>{format(new Date(terms.enactmentDatetime), DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>{t("proposedBy")}</th>
            <td>{proposal.party.id}</td>
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
