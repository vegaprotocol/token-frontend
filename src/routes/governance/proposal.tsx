import "./proposal.scss";

import { useParams } from "react-router";
import { Proposals_proposals } from "./__generated__/Proposals";
import { NetworkChange } from "./network-change";
import { VoteDetails } from "./vote-details";
import { Heading } from "../../components/heading";
import { useTranslation } from "react-i18next";

interface ProposalProps {
  proposals: Proposals_proposals[];
}

export const Proposal = ({ proposals }: ProposalProps) => {
  const { t } = useTranslation();
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposal = proposals.find((proposal) => proposal.id === proposalId);

  if (!proposal) {
    return null;
  }

  return (
    <>
      <Heading title={t("newNetworkParam")} />
      <NetworkChange proposal={proposal} />
      <VoteDetails proposal={proposal} />
    </>
  );
};
