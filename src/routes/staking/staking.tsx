import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useRouteMatch } from "react-router-dom";
import { BulletHeader } from "../../components/bullet-header";
import { Callout } from "../../components/callout";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Links } from "../../lib/external-links";
import { NodeList, NodeListItemProps } from "./node-list";
import { Staking as StakingQueryResult } from "./__generated__/Staking";
import { BigNumber } from "../../lib/bignumber";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { Trans, useTranslation } from "react-i18next";
import { Tick } from "../../components/icons";

export const STAKING_QUERY = gql`
  query Staking($partyId: ID!) {
    party(id: $partyId) {
      id
      delegations {
        amount
        node {
          id
        }
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

    const nodesWithPercentages = data.nodes.map((node) => {
      const stakedTotal = new BigNumber(data?.nodeData?.stakedTotal || 0);
      const stakedOnNode = new BigNumber(node.stakedTotal);
      const stakedTotalPercentage =
        stakedTotal.isEqualTo(0) || stakedOnNode.isEqualTo(0)
          ? "-"
          : stakedOnNode.dividedBy(stakedTotal).times(100).toString() + "%";

      const userStake = data.party?.delegations?.length
        ? data.party?.delegations
            ?.filter((d) => d.node.id === node.id)
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
        stakedTotal,
        stakedTotalPercentage,
        userStake,
        userStakePercentage,
      };
    });

    const sortedByStake = nodesWithPercentages.sort((a, b) => {
      if (a.stakedTotal.isLessThan(b.stakedTotal)) return -1;
      if (a.stakedTotal.isGreaterThan(b.stakedTotal)) return 1;
      return 0;
    });

    return sortedByStake;
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
          {t("stakingStep1")}
        </BulletHeader>
        <StakingStepConnectVegaWallet />
      </section>
      <section>
        <BulletHeader tag="h2">{t("stakingStep2")}</BulletHeader>
        <StakingStepAssociate />
      </section>
      <section>
        <BulletHeader tag="h2">{t("stakingStep3")}</BulletHeader>
        <NodeList nodes={nodes} />
      </section>
    </>
  );
};

export const StakingStepConnectVegaWallet = () => {
  const { t } = useTranslation();
  const {
    appState: { currVegaKey },
    appDispatch,
  } = useAppState();

  if (currVegaKey) {
    return (
      <Callout intent="success" icon={<Tick />}>
        <p>{t("stakingVegaWalletConnected", { key: currVegaKey.pubShort })}</p>
      </Callout>
    );
  }

  return (
    <>
      <p>
        <Trans
          i18nKey="stakingStep1Text"
          components={{
            vegaWalletLink: (
              // eslint-disable-next-line
              <a
                href={Links.VEGA_WALLET_RELEASES}
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}
        />
      </p>
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
            isOpen: true,
          })
        }
        type="button"
      >
        {t("connectVegaWallet")}
      </button>
    </>
  );
};

export const StakingStepAssociate = () => {
  const match = useRouteMatch();
  const { t } = useTranslation();
  const {
    appState: { lien, vegaAssociatedBalance },
  } = useAppState();
  const associated = new BigNumber(lien || 0);
  console.log({ lien, vegaAssociatedBalance });

  if (associated.isGreaterThan(0)) {
    return (
      <Callout intent="success" icon={<Tick />}>
        <p>{t("stakingHasAssociated", { tokens: associated.toString() })}</p>
        <p>
          <Link to="/staking/associate">{t("associateMore")}</Link>
        </p>
      </Callout>
    );
  }

  return (
    <>
      <p>{t("stakingStep2Text")}</p>
      <Link to={`${match.path}/associate`}>
        <button type="button">{t("associateButton")}</button>
      </Link>
    </>
  );
};
