import "./node-list.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";

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
  stakedOnNode: BigNumber;
  stakedTotalPercentage: string;
  userStake: BigNumber;
  userStakePercentage: string;
}

export const NodeListItem = ({
  id,
  stakedOnNode,
  stakedTotalPercentage,
  userStake,
  userStakePercentage,
}: NodeListItemProps) => {
  const { t } = useTranslation();
  const match = useRouteMatch();

  return (
    <li data-testid="node-list-item">
      <Link to={`${match.path}/${id}`}>{id}</Link>
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
