import { useTranslation } from "react-i18next";
import { DexLPStakingContract } from "./index";
import {Button} from "@blueprintjs/core";

const isDepositEnabled = false

/**
 * Maps over a list of dex contracts and shows the connected
 * wallet's balance in the relevant tokens
 *
 * @param contracts An array of DexLPContracts we care about
 * @constructor
 */
export const DexTokensUnstaked = ({
  contracts
}: {
  contracts: DexLPStakingContract[]
}) => {
  const { t } = useTranslation();

  return (
    <section className="dex-rewards-list">
      <h2>{t('liquidityTokensWalletTitle')}</h2>
      <table className={'key-value-table dex-rewards-list-table'}>
        <thead>
        <tr>
          <th>{t('liquidityTokenTitle')}</th>
          <th>{t('liquidityTokenBalance')}</th>
        </tr>
        </thead>
        <tbody>
        {contracts.map(r => (<tr id={r.address}>
          <td>{r.title}</td>
          <td>
            {r.connectedUserBalance.toString()}
            { isDepositEnabled ? <ul>
              <li><Button small={true}>{t('liquidityTokenApprove')}</Button></li>
              <li><Button small={true}>{t('liquidityTokenDeposit')}</Button></li>
            </ul>: null}
          </td>
        </tr>))}
        </tbody>
      </table>

    </section>
  );
};
