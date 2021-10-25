import "./node-list.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import { truncateMiddle } from "../../lib/truncate-middle";

interface NodeListProps {
  nodes: NodeListItemProps[];
}

export const NodeList = ({ nodes }: NodeListProps) => {
  return (
    <ul className="node-list">
      {nodes.map((n, i) => {
        return <NodeListItem key={i} {...n} />;
      })}
    </ul>
  );
};

export interface NodeListItemProps {
  id: string;
  name: string;
  pubkey: string;
  stakedOnNode: BigNumber;
  stakedTotalPercentage: string;
  userStake: BigNumber;
  userStakePercentage: string;
}

export const NodeListItem = ({
  id,
  name,
  pubkey,
  stakedOnNode,
  stakedTotalPercentage,
  userStake,
  userStakePercentage,
}: NodeListItemProps) => {
  const { t } = useTranslation();
  const match = useRouteMatch();

  return (
    <li data-testid="node-list-item">
      <Link to={`${match.path}/${id}`}>
        {name ? (
          <span className="node-list__item-name">{name}</span>
        ) : (
          <>
            <span className="node-list__item-name">[no name]</span>
            <span className="node-list__item-pubkey text-muted" title={pubkey}>
              {truncateMiddle(pubkey)}
            </span>
          </>
        )}
      </Link>
      <table>
        <tbody>
          <tr>
            <th>{t("Total stake")}</th>
            <td>{formatNumber(stakedOnNode)}</td>
            <td>{stakedTotalPercentage}</td>
          </tr>
          <tr>
            <th>{t("Your stake")}</th>
            <td>{formatNumber(userStake)}</td>
            <td>{userStakePercentage}</td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};
