import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useRouteMatch } from "react-router-dom";
import "./node-list.scss";
import {
  Staking,
  Staking_nodeData,
  Staking_nodes,
} from "./__generated__/Staking";
import { BigNumber } from "../../lib/bignumber";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useTranslation } from "react-i18next";

const NODES_QUERY = gql`
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

export const NodeList = () => {
  const { appState } = useAppState();

  const { data, loading } = useQuery<Staking>(NODES_QUERY, {
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

  if (loading || !data?.nodes) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="node-list">
      {nodes.map((n, i) => {
        return <NodeListItem key={i} {...n} />;
      })}
    </ul>
  );
};

interface NodeListItemProps {
  id: string;
  stakedTotal: string;
  stakedTotalPercentage: string;
  userStake: string;
  userStakePercentage: string;
}

export const NodeListItem = ({
  id,
  stakedTotal,
  stakedTotalPercentage,
  userStake,
  userStakePercentage,
}: NodeListItemProps) => {
  const { t } = useTranslation();
  const match = useRouteMatch();

  return (
    <li>
      {id ? <Link to={`${match.path}/${id}`}>{id}</Link> : t("Node invalid")}
      <table>
        <tbody>
          <tr>
            <th>{t("Total stake")}</th>
            <td>{stakedTotal}</td>
            <td>{stakedTotalPercentage}</td>
          </tr>
          <tr>
            <th>{t("Your stake")}</th>
            <td>{userStake}</td>
            <td>{userStakePercentage}</td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};
