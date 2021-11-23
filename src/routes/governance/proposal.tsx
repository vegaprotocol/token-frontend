import { NetworkChange } from "./network-change";
import { VoteDetails } from "./vote-details";
import { Heading } from "../../components/heading";
import { useTranslation } from "react-i18next";
import { Proposal_proposal } from "./__generated__/Proposal";

interface ProposalProps {
  proposal: Proposal_proposal;
}

export const Proposal = ({ proposal }: ProposalProps) => {
  const { t } = useTranslation();

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
