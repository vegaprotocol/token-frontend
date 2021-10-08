import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { useVegaWallet } from "../../contexts/vega-wallet/vega-wallet-context";

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
  children: ({ data }: { data?: StakingQueryResult }) => React.ReactElement;
}) => {
  const { t } = useTranslation();
  const { vegaWalletState } = useVegaWallet();
  const { data, loading, error } = useQuery<StakingQueryResult>(STAKING_QUERY, {
    variables: { partyId: vegaWalletState.currKey?.pub || "" },
    skip: !vegaWalletState.currKey?.pub,
    pollInterval: 10000,
    fetchPolicy: "network-only",
  });
  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error.message}</pre>
      </Callout>
    );
  } else if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }
  return children({ data });
};
