import { useTranslation } from "react-i18next";
import "./dex-rewards-list.scss"
import {EtherscanLink} from "../../components/etherscan-link";
import {useAppState} from "../../contexts/app-state/app-state-context";
import {DexLiquidityRewards} from "../../config";

/**
 * Maps over a list of contracts and fetches the total
 * reward deposited in that contract
 *
 * @constructor
 */
export const DexRewardsList = ({ contracts, hideBalance }: {
  contracts: DexLiquidityRewards[],
  hideBalance: boolean
}) => {
  const { t } = useTranslation();

  const {
    appState: { chainId },
  } = useAppState();

  return (
    <section className="dex-rewards-list">
      <h2>{t('liquidityTotalAvailableRewards')}</h2>
      <table className={'key-value-table dex-rewards-list-table'}>
        <thead>
          <tr>
            <th>{t('liquidityTotalAvailableRewardsToken')}</th>
            <th>{t('liquidityTotalAvailableAddress')}</th>
            {hideBalance ? null : <th>{t('liquidityTotalAvailableRewardsBalance')}</th>}
          </tr>
        </thead>
        <tbody>
          {contracts.map(r => (<tr id={r.address}>
            <td>{r.title}</td>
            <td><EtherscanLink chainId={chainId} hash={r.address} text={r.address} /></td>
            {hideBalance ? null : <td>0</td>}
          </tr>))}
        </tbody>
      </table>

    </section>
  );
};
