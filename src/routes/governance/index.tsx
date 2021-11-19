import React from "react";
import compact from "lodash/compact";
import flow from "lodash/flow";
import orderBy from "lodash/orderBy";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { gql, useQuery } from "@apollo/client";
import { Proposals } from "./__generated__/proposals";
import { Callout } from "../../components/callout";
import { ProposalsList } from "./proposals-list";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { updateProposals } from "./update-proposals";
import { Proposal } from "./proposal";
import { Flags } from "../../config";
import { Heading } from "../../components/heading";

export const PROPOSALS_FRAGMENT = gql`
  fragment ProposalFields on Proposal {
    id
    reference
    state
    datetime
    rejectionReason
    party {
      id
    }
    terms {
      closingDatetime
      enactmentDatetime
      change {
        ... on NewMarket {
          instrument {
            name
          }
        }
        ... on UpdateMarket {
          marketId
        }
        ... on NewAsset {
          __typename
          symbol
          source {
            ... on BuiltinAsset {
              maxFaucetAmountMint
            }
            ... on ERC20 {
              contractAddress
            }
          }
        }
        ... on UpdateNetworkParameter {
          networkParameter {
            key
            value
          }
        }
      }
    }
    votes {
      yes {
        totalTokens
        totalNumber
        votes {
          value
          party {
            id
          }
          datetime
        }
      }
      no {
        totalTokens
        totalNumber
        votes {
          value
          party {
            id
          }
          datetime
        }
      }
    }
  }
`;

export const PROPOSALS_QUERY = gql`
  ${PROPOSALS_FRAGMENT}
  query Proposals {
    proposals {
      ...ProposalFields
    }
  }
`;

export const PROPOSAL_SUBSCRIPTION = gql`
  ${PROPOSALS_FRAGMENT}
  subscription ProposalsSub {
    proposals {
      ...ProposalFields
    }
  }
`;

const GovernanceRouter = ({ name }: RouteChildProps) => {
  const match = useRouteMatch();
  useDocumentTitle(name);
  const { data, loading, error, subscribeToMore } = useQuery<Proposals, never>(
    PROPOSALS_QUERY
  );

  React.useEffect(() => {
    const unsub = subscribeToMore({
      document: PROPOSAL_SUBSCRIPTION,
      // @ts-ignore
      updateQuery: (prev, data) => updateProposals(prev, data),
    });

    return () => {
      unsub();
    };
  }, [subscribeToMore]);

  const proposalsData = React.useMemo(() => {
    if (!data?.proposals?.length) {
      return [];
    }

    return flow([
      compact,
      (arr) =>
        orderBy(
          arr,
          [
            (p) => new Date(p.terms.closingDatetime),
            (p) => new Date(p.terms.enactmentDatetime),
          ],
          ["asc", "asc"]
        ),
    ])(data.proposals);
  }, [data]);

  const { t } = useTranslation();

  if (Flags.GOVERNANCE_DISABLED) {
    return (
      <>
        <Heading title={t("pageTitleGovernance")} />
        <section>{t("Governance is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</section>
      </>
    );
  } else if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <>
      <Heading title={t("pageTitleGovernance")} />
      <Switch>
        <Route path={match.path} exact>
          {error ? (
            <Callout intent="error" title={t("Something went wrong")}>
              <pre>{error.message}</pre>
            </Callout>
          ) : (
            <ProposalsList proposals={proposalsData} />
          )}
        </Route>
        <Route path={`${match.path}/:proposalId`}>
          {error ? (
            <Callout intent="error" title={t("Something went wrong")}>
              <pre>{error.message}</pre>
            </Callout>
          ) : (
            <Proposal proposals={proposalsData} />
          )}
        </Route>
      </Switch>
    </>
  );
};

export default GovernanceRouter;
