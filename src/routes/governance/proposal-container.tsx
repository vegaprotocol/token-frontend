import { gql, useQuery } from "@apollo/client";
import { Callout } from "../../components/callout";
import { useTranslation } from "react-i18next";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { PROPOSALS_FRAGMENT } from "./proposal-fragment";
import { Proposal } from "./proposal";
import {
  Proposal as ProposalQueryResult,
  ProposalVariables,
} from "./__generated__/Proposal";
import { useParams } from "react-router";

export const PROPOSAL_QUERY = gql`
  ${PROPOSALS_FRAGMENT}
  query Proposal($proposalId: ID!) {
    proposal(id: $proposalId) {
      ...ProposalFields
    }
  }
`;

export const ProposalContainer = () => {
  const { t } = useTranslation();
  const params = useParams<{ proposalId: string }>();
  const { data, loading, error } = useQuery<
    ProposalQueryResult,
    ProposalVariables
  >(PROPOSAL_QUERY, {
    variables: { proposalId: params.proposalId },
    pollInterval: 5000,
  });

  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error.message}</pre>
      </Callout>
    );
  }

  if (loading || !data) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return <Proposal proposal={data.proposal} />;
};
