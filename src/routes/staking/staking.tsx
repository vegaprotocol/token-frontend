import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { BulletHeader } from "../../components/bullet-header";
import { Callout } from "../../components/callout";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { Links } from "../../lib/external-links";
import { NodeList, NodeListItemProps } from "./node-list";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { BigNumber } from "../../lib/bignumber";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { useTranslation } from "react-i18next";

export const STAKING_QUERY = gql`
  query Staking($partyId: ID!) {
    party(id: $partyId) {
      id
      delegations {
        amount
        node
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

export const Staking = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  const { data, loading, error } = useQuery<StakingQueryResult>(STAKING_QUERY, {
    variables: { partyId: appState.currVegaKey?.pub || "" },
    skip: !appState.currVegaKey?.pub,
  });

  const nodes = React.useMemo<NodeListItemProps[]>(() => {
    if (!data?.nodes) return [];

    return data.nodes.map((node) => {
      const stakedTotal = new BigNumber(data?.nodeData?.stakedTotal || 0);
      const stakedOnNode = new BigNumber(node.stakedTotal);
      const stakedTotalPercentage =
        stakedTotal.isEqualTo(0) || stakedOnNode.isEqualTo(0)
          ? "-"
          : stakedOnNode.dividedBy(stakedTotal).times(100).toString() + "%";

      const userStake = data.party?.delegations?.length
        ? data.party?.delegations
            ?.filter((d) => d.node === node.id)
            .reduce((sum, d) => {
              const value = new BigNumber(d.amount);
              return sum.plus(value);
            }, new BigNumber(0))
        : new BigNumber(0);

      const userStakePercentage =
        userStake.isEqualTo(0) || stakedOnNode.isEqualTo(0)
          ? "-"
          : userStake.dividedBy(stakedOnNode).times(100).toString() + "%";

      return {
        id: node.id,
        stakedTotal: stakedTotal.toString(),
        stakedTotalPercentage,
        userStake: userStake.toString(),
        userStakePercentage,
      };
    });
  }, [data]);

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

  return (
    <>
      <section>
        <BulletHeader tag="h2" style={{ marginTop: 0 }}>
          Step 1. Connect to a vega wallet
        </BulletHeader>
        <p>
          You will need a{" "}
          <a href={Links.VEGA_WALLET_RELEASES} target="_blank" rel="noreferrer">
            Vega wallet
          </a>{" "}
          to control stake and receive staking rewards.
        </p>
      </section>
      <section>
        <BulletHeader tag="h2">
          Step 2. Associate tokens with a Vega wallet
        </BulletHeader>
        <p>
          Your tokens need to be{" "}
          <Link to="/associate">associated with a Vega wallet</Link> so that it
          can control your stake
        </p>
      </section>
      <section>
        <BulletHeader tag="h2">
          Step 3. Select the validator you'd like to nominate
        </BulletHeader>
        <NodeList nodes={nodes} />
      </section>
    </>
  );
};
