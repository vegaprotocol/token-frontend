import { format } from "date-fns";
import {
  Proposals_proposals,
  Proposals_proposals_terms_change_UpdateNetworkParameter,
} from "./__generated__/proposals";
import { useTranslation } from "react-i18next";

interface NetworkChangeProps {
  proposal: Proposals_proposals;
}

export const NetworkChange = ({proposal}: NetworkChangeProps) => {
  const { t } = useTranslation();

  const { terms } = proposal;
  const networkParameter = (
    terms.change as Proposals_proposals_terms_change_UpdateNetworkParameter
  ).networkParameter;

  const proposedDate = new Date(proposal.datetime).getTime();

  return (
    <>
      <section>
        <h1>{t("newNetworkParam")}</h1>
        <h2 className="proposal__sub-title">{t("networkChanges")}</h2>
        <h2 className="proposal__top-title">{networkParameter.key}</h2>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("proposedNewValue")}&nbsp;</p>
          <span className="proposal__item-right">
            {networkParameter.value}
          </span>
        </div>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("toEnactOn")}&nbsp;</p>
          <span className="proposal__item-right">
            {terms.enactmentDatetime}
          </span>
        </div>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("proposedBy")}&nbsp;</p>
          <span className="proposal__item-right">{proposal.party.id}</span>
        </div>

        <div className="proposal__row">
          <p className="proposal__item-left">{t("proposedOn")}&nbsp;</p>
          <span className="proposal__item-right">
            {format(proposedDate, "d MMM yyyy")}
          </span>
        </div>
      </section>
    </>
  );
};
