import { useTranslation } from "react-i18next";
import "./dex-rewards-list.scss"
import {DexLPStakingContract} from "./index";

/**
 * Maps over a list of contracts and fetches the total
 * reward deposited in that contract
 *
 * @constructor
 */
export const DexRewardsList = ({ contracts }: { contracts: DexLPStakingContract[]}) => {
  const { t } = useTranslation();

  return (
    <section className="dex-rewards-list">
      <h2>{t('liquidityTotalAvailableRewards')}</h2>
      <table className={'key-value-table dex-rewards-list-table'}>
        <thead>
          <tr>
            <th>{t('liquidityTotalAvailableRewardsToken')}</th>
            <th>{t('liquidityTotalAvailableRewardsBalance')}</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(r => (<tr id={r.address}>
            <td>{r.title}</td>
            <td>{r.availableRewardBalance.toString()}</td>
          </tr>))}
        </tbody>
      </table>

    </section>
  );
};
