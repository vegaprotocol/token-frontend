import "./node-list.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Staking_epoch } from "./__generated__/Staking";
import { EpochCountdown } from "../../components/epoch-countdown";

interface NodeListProps {
  nodes: NodeListItemProps[];
  epoch: Staking_epoch | undefined;
}

export const NodeList = ({ nodes, epoch }: NodeListProps) => {
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
      <ul className="node-list">
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
            <td>{formatNumber(stakedOnNode, 2)}</td>
            <td>{stakedTotalPercentage}</td>
          </tr>
          <tr>
            <th>{t("Your stake")}</th>
            <td>{formatNumber(userStake, 2)}</td>
            <td>{userStakePercentage}</td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};
