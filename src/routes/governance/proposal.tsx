import "./proposal.scss";

import { format } from "date-fns";
import { useParams } from "react-router";
import {
  Proposals_proposals,
  Proposals_proposals_terms_change_UpdateNetworkParameter,
} from "./__generated__/proposals";
import { useTranslation } from "react-i18next";

interface ProposalProps {
  proposals: Proposals_proposals[];
}

export const Proposal = ({ proposals }: ProposalProps) => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposal = proposals.find((proposal) => proposal.id === proposalId);

  const { t } = useTranslation();

  console.log(proposal);
  if (!proposal) {
    return <div>err</div>;
  }
  const { terms } = proposal;
  const networkParameter = (
    terms.change as Proposals_proposals_terms_change_UpdateNetworkParameter
  ).networkParameter;

  const proposedDate = new Date(proposal.datetime).getTime();

  return (
    <div>
      <section>
        <h1>{t("newNetworkParam")}</h1>
        <h4 className="proposal__sub-title">{t("networkChanges")}</h4>
        <h4 className="proposal__top-title">{networkParameter.key}</h4>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("proposedNewValue")}&nbsp;</p>
          <span className="proposals__item-right">
            {networkParameter.value}
          </span>
        </div>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("toEnactOn")}&nbsp;</p>
          <span className="proposals__item-right">
            {terms.enactmentDatetime}
          </span>
        </div>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("proposedBy")}&nbsp;</p>
          <span className="proposals__item-right">{proposal.party.id}</span>
        </div>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("proposedOn")}&nbsp;</p>
          <span className="proposals__item-right">
            {format(proposedDate, "d MMM yyyy")}
          </span>
        </div>
      </section>
    </div>
  );
};
