import { useTranslation } from "react-i18next";
import { DexLPStakingContract } from "./index";
import {Button} from "@blueprintjs/core";

const isWithdrawEnabled = false

/**
 * Maps over a list of contracts and displays how much a user
 * has staked in each
 *
 * @param contracts An array of DexLPContracts we care about
 * @constructor
 */
export const DexTokensStaked = ({
  contracts
}: {
  contracts: DexLPStakingContract[]
}) => {
  const { t } = useTranslation();
  return (
    <section className="dex-rewards-list">
      <h2>{t('liquidityTokensContractTitle')}</h2>
      <table className={'key-value-table dex-rewards-list-table'}>
        <thead>
        <tr>
          <th>{t('liquidityStakedToken')}</th>
          <th>{t('liquidityStakedBalance')}</th>
          <th>{t('liquidityStakedRewards')}</th>
        </tr>
        </thead>
        <tbody>
        {contracts.map(r => (<tr id={r.address}>
          <td>{r.title}</td>
          <td>{r.connectedUserBalance.toString()}</td>
          <td>
            {r.connectedUserRewardBalance.toString()} VEGA
            {isWithdrawEnabled ? <p><Button small={true}>
              {t('liquidityStakedWithdraw')}
            </Button></p> : null}
          </td>
        </tr>))}
        </tbody>
      </table>

    </section>
  );
};
