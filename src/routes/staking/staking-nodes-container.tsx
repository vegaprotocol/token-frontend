import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { useVegaUser } from "../../hooks/use-vega-user";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { useMinDelegation } from "../../hooks/use-min-delegation";
import { BigNumber } from "../../lib/bignumber";

export const STAKING_QUERY = gql`
  query Staking($partyId: ID!) {
    party(id: $partyId) {
      stake {
        currentStakeAvailable
      }
      id
      delegations {
        amount
        epoch
        node {
          id
        }
      }
    }
    epoch {
      id
      timestamps {
        start
        end
        expiry
      }
    }
    nodes {
      id
      pubkey
      infoUrl
      location
      stakedByOperator
      stakedByDelegates
      stakedTotal
      pendingStake
      epochData {
        total
        offline
        online
      }
      status
    }
    nodeData {
      stakedTotal
      totalNodes
      inactiveNodes
      validatingNodes
      uptime
    }
  }
`;

export const StakingNodesContainer = ({
  children,
}: {
  children: ({
    data,
  }: {
    data?: StakingQueryResult;
    minDelegation: BigNumber;
  }) => React.ReactElement;
}) => {
  const { t } = useTranslation();
  const { currVegaKey } = useVegaUser();
  const { data, loading, error } = useQuery<StakingQueryResult>(STAKING_QUERY, {
    variables: { partyId: currVegaKey?.pub || "" },
    skip: !currVegaKey?.pub,
    pollInterval: 10000,
    fetchPolicy: "network-only",
  });
  const minDelegation = useMinDelegation();
  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error.message}</pre>
      </Callout>
    );
  } else if (loading || !minDelegation) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }
  return children({ data, minDelegation });
};
