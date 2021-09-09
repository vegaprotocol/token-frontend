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
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { AssociateContainer } from "../staking/associate/associate-page";
import { DisassociateContainer } from "../staking/disassociate/disassociate-page";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";

export const PROPOSALS_FRAGMENT = gql`
  fragment ProposalFields on Proposal {
    id
    name @client
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
        totalWeight
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
        totalWeight
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
    pending @client
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
    PROPOSALS_QUERY,
    {
      errorPolicy: "ignore",
    }
  );

  React.useEffect(() => {
    const unsub = subscribeToMore({
      document: PROPOSAL_SUBSCRIPTION,
      // @ts-ignore
      //  https://github.com/vegaprotocol/token-frontend/issues/397
      updateQuery: console.log("update here"),
    });

    return () => {
      unsub();
    };
  }, [subscribeToMore]);

  const proposals = React.useMemo(() => {
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

  if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <TemplateSidebar
      title={t("pageTitleGovernance")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Switch>
        <Route path={`${match.path}/associate`}>
          <AssociateContainer />
        </Route>
        <Route path={`${match.path}/disassociate`}>
          <DisassociateContainer />
        </Route>
        <Route path={match.path} exact>
          {error ? (
            <Callout intent="error" title={t("Something went wrong")}>
              <pre>{error.message}</pre>
            </Callout>
          ) : (
            <ProposalsList data={proposals} />
          )}
        </Route>
        <Route path={`${match.path}/:node`}>
          {error ? (
            <Callout intent="error" title={t("Something went wrong")}>
              <pre>{error.message}</pre>
            </Callout>
          ) : (
            <div>Placeholder</div>
          )}
        </Route>
      </Switch>
    </TemplateSidebar>
  );
};

export default GovernanceRouter;
