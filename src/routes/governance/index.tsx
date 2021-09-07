import React from "react";
import compact from "lodash/compact";
import flow from "lodash/flow";
import orderBy from "lodash/orderBy";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { gql, useQuery } from "@apollo/client";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { proposals } from "./__generated__/proposals";
import { Callout } from "../../components/callout";
import { ProposalsList } from "./proposals-list";
import { Flags } from "../../flags";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { AssociateContainer } from "../staking/associate/associate-page";
import { DisassociateContainer } from "../staking/disassociate/disassociate-page";
import { StakingNodeContainer } from "../staking/staking-node";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";

export const PROPOSALS_QUERY = gql`
  query Proposals {
    proposals {
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
  }
`;

export const proposalsSubscription = gql`
  subscription proposalsSub {
    proposals {
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
          ... on UpdateNetworkParameter {
            __typename
            networkParameter {
              key
              value
            }
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
  }
`;

const GovernanceRouter = ({ name }: RouteChildProps) => {
  const match = useRouteMatch();
  useDocumentTitle(name);
  const { data, loading, error, subscribeToMore } = useQuery<proposals, never>(
    PROPOSALS_QUERY,
    {
      errorPolicy: "ignore",
    }
  );

  React.useEffect(() => {
    const unsub = subscribeToMore({
      document: proposalsSubscription,
      // @ts-ignore
      updateQuery: (prev, data) => updateProposals(prev, data, notify),
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

  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error.message}</pre>
      </Callout>
    );
  }

  if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return Flags.MAINNET_DISABLED ? (
    <TemplateDefault title={t("pageTitleGovernance")}>
      <div>{t("Governance is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
    </TemplateDefault>
  ) : (
    <TemplateSidebar
      title={t("pageTitleGovernance")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      {Flags.MAINNET_DISABLED ? (
        <div>{t("Governance is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
      ) : (
        <Switch>
          <Route path={`${match.path}/associate`}>
            <AssociateContainer />
          </Route>
          <Route path={`${match.path}/disassociate`}>
            <DisassociateContainer />
          </Route>
          <Route path={`${match.path}/:node`}>
            <StakingNodeContainer />
          </Route>
          <Route path={match.path} exact>
            <p>{t("proposedChangesToVegaNetwork")}</p>
            <p>{t("vegaTokenHoldersCanVote")}</p>
            <p>{t("requiredMajorityDescription")}</p>
            <h2>{t("proposals")}</h2>
            <ProposalsList data={proposals} />
          </Route>
        </Switch>
      )}
    </TemplateSidebar>
  );
};

export default GovernanceRouter;
