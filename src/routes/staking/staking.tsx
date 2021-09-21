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
import { Trans, useTranslation } from "react-i18next";
import { Tick } from "../../components/icons";
import { truncateMiddle } from "../../lib/truncate-middle";
import { useVegaUser } from "../../hooks/use-vega-user";

export const STAKING_QUERY = gql`
  query Staking($partyId: ID!) {
    party(id: $partyId) {
      stake {
        formattedCurrentStakeAvailable @client
        currentStakeAvailable
      }
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
  const { currVegaKey } = useVegaUser();
  const { data, loading, error } = useQuery<StakingQueryResult>(STAKING_QUERY, {
    variables: { partyId: currVegaKey?.pub || "" },
    skip: !currVegaKey?.pub,
  });
  let stakingStep = null;
  if (error) {
    stakingStep = (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error.message}</pre>
      </Callout>
    );
  } else if (loading) {
    stakingStep = <div>{t("Loading")}</div>;
  } else {
    stakingStep = <StakingStepSelectNode data={data} />;
  }

  return (
    <>
      <section>
        <BulletHeader tag="h2" style={{ marginTop: 0 }}>
          {t("stakingStep1")}
        </BulletHeader>
        <StakingStepConnectWallets />
      </section>
      <section>
        <BulletHeader tag="h2">{t("stakingStep2")}</BulletHeader>
        <StakingStepAssociate
          associated={
            new BigNumber(
              data?.party?.stake.formattedCurrentStakeAvailable || "0"
            )
          }
        />
      </section>
      <section>
        <BulletHeader tag="h2">{t("stakingStep3")}</BulletHeader>
        {stakingStep}
      </section>
    </>
  );
};

export const StakingStepConnectWallets = () => {
  const { t } = useTranslation();
  const {
    appState: { ethAddress, currVegaKey },
    appDispatch,
  } = useAppState();

  if (currVegaKey && ethAddress) {
    return (
      <Callout intent="success" icon={<Tick />}>
        <p>
          {t("Connected Ethereum address")} {truncateMiddle(ethAddress)}
        </p>
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
      {ethAddress ? (
        <p>Ethereum wallet connected: {truncateMiddle(ethAddress)}</p>
      ) : (
        <p>
          <button
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
                isOpen: true,
              })
            }
            className="fill"
            type="button"
          >
            {t("Connect to an Ethereum wallet")}
          </button>
        </p>
      )}
      {currVegaKey ? (
        <p>Vega wallet connected: {currVegaKey.pubShort}</p>
      ) : (
        <p>
          <button
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: true,
              })
            }
            className="fill"
            type="button"
          >
            {t("connectVegaWallet")}
          </button>
        </p>
      )}
    </>
  );
};

export const StakingStepAssociate = ({
  associated,
}: {
  associated: BigNumber;
}) => {
  const match = useRouteMatch();
  const { t } = useTranslation();

  if (associated.isGreaterThan(0)) {
    return (
      <Callout
        intent="success"
        icon={<Tick />}
        title={t("stakingHasAssociated", { tokens: associated.toString() })}
      >
        <p>
          <Link to="/staking/associate">
            <button className="fill">{t("stakingAssociateMoreButton")}</button>
          </Link>
        </p>
        <Link to="/staking/disassociate">
          <button className="fill">{t("stakingDisassociateButton")}</button>
        </Link>
      </Callout>
    );
  }

  return (
    <>
      <p>{t("stakingStep2Text")}</p>
      <Link to={`${match.path}/associate`}>
        <button type="button" className="fill">
          {t("associateButton")}
        </button>
      </Link>
    </>
  );
};

export const StakingStepSelectNode = ({
  data,
}: {
  data?: StakingQueryResult;
}) => {
  const { t } = useTranslation();
  const { currVegaKey } = useVegaUser();

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
        stakedOnNode,
        stakedTotalPercentage,
        userStake,
        userStakePercentage,
      };
    });
    const sortedByStake = nodesWithPercentages.sort((a, b) => {
      if (a.stakedTotal.isLessThan(b.stakedTotal)) return -1;
      if (a.stakedTotal.isGreaterThan(b.stakedTotal)) return 1;
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });

    return sortedByStake;
  }, [data]);

  if (!currVegaKey) {
    return <p className="text-muted">{t("connectVegaWallet")}</p>;
  }

  return <NodeList nodes={nodes} />;
};
