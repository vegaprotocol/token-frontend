import "./node-list.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
