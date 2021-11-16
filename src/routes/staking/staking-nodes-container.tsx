import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { useVegaUser } from "../../hooks/use-vega-user";
import { Staking as StakingQueryResult } from "./__generated__/Staking";

export const STAKING_QUERY = gql`
  query Staking($partyId: ID!) {
    party(id: $partyId) {
      id
      stake {
        currentStakeAvailable
        currentStakeAvailableFormatted @client
      }
      id
      delegations {
        amount
        amountFormatted @client
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
      name
      pubkey
      infoUrl
      location
      stakedByOperator
      stakedByDelegates
      stakedTotal
      pendingStake
      stakedByOperatorFormatted @client
      stakedByDelegatesFormatted @client
      stakedTotalFormatted @client
      pendingStakeFormatted @client
      epochData {
        total
        offline
        online
      }
      status
    }
    nodeData {
      stakedTotal
      stakedTotalFormatted @client
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
  const { currVegaKey } = useVegaUser();
  const { data, loading, error, refetch } = useQuery<StakingQueryResult>(
    STAKING_QUERY,
    {
      variables: { partyId: currVegaKey?.pub || "" },
      skip: !currVegaKey?.pub,
    }
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!data?.epoch.timestamps.expiry) return;
      const now = Date.now();
      const expiry = new Date(data.epoch.timestamps.expiry).getTime();

      if (now > expiry) {
        refetch();
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [data?.epoch.timestamps.expiry, refetch]);

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

  return children({ data });
};
