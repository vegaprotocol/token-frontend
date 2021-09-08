import { useTranslation } from "react-i18next";
import "./dex-rewards-list.scss"
import {EtherscanLink} from "../../components/etherscan-link";
import {useAppState} from "../../contexts/app-state/app-state-context";
import {DexContractState} from "./dex-liquidity-reducer";

/**
 * Maps over a list of contracts and fetches the total
 * reward deposited in that contract
 *
 * @constructor
 */
export const DexRewardsList = ({ contracts }: {
  contracts
}) => {
  const { t } = useTranslation();

  const {
    appState: { chainId },
  } = useAppState();

  return (
    <section className="dex-rewards-list">
      <h2>{t('liquidityTotalAvailableRewards')}</h2>
      <table className="dex-rewards-list-table key-value-table">
        <thead className="key-value-table__header">
          <tr>
            <th>{t('liquidityTotalAvailableRewardsToken')}</th>
            <th>{t('liquidityTotalAvailableAddress')}</th>
            <th>{t('liquidityTotalAvailableRewardsBalance')}</th>
          </tr>
        </thead>
        <tbody>
            <td>{r.title}</td>
            <td><EtherscanLink chainId={chainId} hash={r.address} text={r.address} /></td>
            <td>0</td>
          </tr>
        </tbody>
      </table>

    </section>
  );
};
