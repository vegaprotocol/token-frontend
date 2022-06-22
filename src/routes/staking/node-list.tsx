import "./node-list.scss";

import { gql, useQuery } from "@apollo/client";
import { Callout } from "@vegaprotocol/ui-toolkit";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";

import { EpochCountdown } from "../../components/epoch-countdown";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Nodes } from "./__generated__/Nodes";
import { Scores, Scores_epoch } from "./__generated__/Scores";
import { Staking_epoch, Staking_party } from "./__generated__/Staking";

export const NODES_QUERY = gql`
  query Nodes {
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

const SCORES_QUERY = gql`
  query Scores($epochId: String!) {
    epoch(id: $epochId) {
      id
      validators {
        id
        rewardScore {
          validatorScore
          normalisedScore
          performanceScore
          rawValidatorScore
          multisigScore
        }
      }
    }
  }
`;

interface NodeListProps {
  epoch: Staking_epoch | undefined;
}

export const NodeList = ({ epoch }: NodeListProps) => {
  const { t } = useTranslation();
  const { data, error, loading } = useQuery<Nodes>(NODES_QUERY);

  const {
    data: scoresData,
    loading: scoresLoading,
    error: scoresError,
  } = useQuery<Scores>(SCORES_QUERY, {
    variables: { epochId: Number(epoch?.id) - 1 || "" },
    skip: !Boolean(epoch?.id) || epoch?.id === "0",
  });

  const nodes = React.useMemo<NodeListItemProps[]>(() => {
    if (!data?.nodes) return [];

    const nodesWithPercentages = data.nodes.map((node) => {
      const stakedTotal = new BigNumber(
        data?.nodeData?.stakedTotalFormatted || 0
      );
      const stakedOnNode = new BigNumber(node.stakedTotalFormatted);
      const stakedTotalPercentage =
        stakedTotal.isEqualTo(0) || stakedOnNode.isEqualTo(0)
          ? "-"
          : stakedOnNode.dividedBy(stakedTotal).times(100).dp(2).toString() +
            "%";

      return {
        id: node.id,
        name: node.name,
        pubkey: node.pubkey,
        stakedTotal,
        stakedOnNode,
        stakedTotalPercentage,
        epoch,
        scores: scoresData?.epoch,
      };
    });

    return nodesWithPercentages;
  }, [
    data?.nodeData?.stakedTotalFormatted,
    data?.nodes,
    epoch,
    scoresData?.epoch,
  ]);

  if (error || scoresError) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error?.message || scoresError?.message}</pre>
      </Callout>
    );
  }

  if (loading || scoresLoading) {
    return (
      <div>
        <p>{t("Loading")}</p>
      </div>
    );
  }

  return (
    <>
      {epoch && epoch.timestamps.start && epoch.timestamps.expiry && (
        <EpochCountdown
          containerClass="staking-node__epoch"
          id={epoch.id}
          startDate={new Date(epoch.timestamps.start)}
          endDate={new Date(epoch.timestamps.expiry)}
        />
      )}
      <ul className="node-list" data-testid="validator-node-list">
        {nodes.map((n, i) => {
          return <NodeListItem key={i} {...n} />;
        })}
      </ul>
    </>
  );
};

export interface NodeListItemProps {
  id: string;
  name: string;
  stakedOnNode: BigNumber;
  stakedTotalPercentage: string;
  scores: Scores_epoch | undefined;
}

export const NodeListItem = ({
  id,
  name,
  stakedOnNode,
  stakedTotalPercentage,
  scores,
}: NodeListItemProps) => {
  const { t } = useTranslation();
  const match = useRouteMatch();

  const nodeScores = useMemo(() => {
    return scores?.validators.find(({ id: validatorId }) => id === validatorId);
  }, [id, scores?.validators]);

  return (
    <li data-testid="node-list-item">
      <Link to={`${match.path}/${id}`}>
        {name ? (
          <span className="node-list__item-name">{name}</span>
        ) : (
          <>
            <span className="node-list__item-name">
              {t("validatorTitleFallback")}
            </span>
            <span
              className="node-list__item-id text-muted"
              title={`${t("id")}: ${id}`}
            >
              {truncateMiddle(id)}
            </span>
          </>
        )}
      </Link>
      <table>
        <tbody>
          <tr>
            <th>{t("Total stake")}</th>
            <td>
              {formatNumber(stakedOnNode, 2)} ({stakedTotalPercentage})
            </td>
          </tr>
          {nodeScores?.rewardScore
            ? Object.entries(nodeScores.rewardScore)
                .filter(([key]) => key !== "__typename")
                .map(([key, value]) => (
                  <tr>
                    <th>{t(key)}</th>
                    <td>{value}</td>
                  </tr>
                ))
            : null}
        </tbody>
      </table>
    </li>
  );
};
