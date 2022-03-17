import { gql, useQuery } from "@apollo/client";
import { Callout } from "@vegaprotocol/ui-toolkit";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { SplashLoader } from "../../../components/splash-loader";
import { SplashScreen } from "../../../components/splash-screen";
import { EnvironmentNodes } from "../../../config";
import useFetch from "../../../hooks/use-fetch";
import { Proposal } from "../components/proposal";
import { PROPOSALS_FRAGMENT } from "../proposal-fragment";
import {
  Proposal as ProposalQueryResult,
  ProposalVariables,
} from "./__generated__/Proposal";

/**
 * TODO: how do we do this properly to ensure that it is kept up to date?
 */
export interface RestProposalResponse {
  data: {
    proposal: {
      terms: any;
    };
  };
}

export const PROPOSAL_QUERY = gql`
  ${PROPOSALS_FRAGMENT}
  query Proposal($proposalId: ID!) {
    proposal(id: $proposalId) {
      ...ProposalFields
    }
  }
`;

const useVegaRest = function <T>({ url }: { url: string }) {
  const endpoint = React.useMemo(() => `${EnvironmentNodes[0]}/${url}`, [url]);
  return useFetch<T>(endpoint);
};

export const ProposalContainer = () => {
  const { t } = useTranslation();
  const params = useParams<{ proposalId: string }>();
  const {
    state: { loading: restLoading, error: restError, data: restData },
  } = useVegaRest<RestProposalResponse>({
    url: `datanode/rest/governance/proposal/${params.proposalId}`,
  });

  const { data, loading, error } = useQuery<
    ProposalQueryResult,
    ProposalVariables
  >(PROPOSAL_QUERY, {
    fetchPolicy: "no-cache",
    variables: { proposalId: params.proposalId },
    pollInterval: 5000,
  });

  if (error || restError) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error?.message || restError?.message}</pre>
      </Callout>
    );
  }

  if (loading || !data || restLoading || !restData) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <Proposal proposal={data.proposal} terms={restData?.data.proposal.terms} />
  );
};
