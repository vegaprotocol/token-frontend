import "./tranche-table.scss";

import { useTranslation } from "react-i18next";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { BigNumber } from "../../lib/bignumber";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { format } from "date-fns";

export interface TrancheTableProps {
  tranche: Tranche;
  address: string;
  locked: BigNumber;
  vested: BigNumber;
}

export const TrancheTable = ({
  tranche,
  address,
  locked,
  vested,
}: TrancheTableProps) => {
  const { t } = useTranslation();
  console.log(tranche);
  // TODO duplicated, should this be a hook?
  const userTrancheInformation = tranche.users.find(
    ({ address: a }) => a.toLowerCase() === address.toLowerCase()
  );
  const total = userTrancheInformation.total_tokens;
  const trancheFullyLocked =
    tranche.tranche_start.getTime() > new Date().getTime();
  const reduceStakeAmount = 1;
  const redeemable = reduceStakeAmount < 0;
  return (
    <section data-testid="tranche-table" className="tranche-table">
      <KeyValueTable numerical={true}>
        <KeyValueTableRow
          data-testid="tranche-table-total"
          className="tranche-table__no-borders"
        >
          <th>
            <span className="tranche-table__label">
              {t("Tranche")} {tranche.tranche_id}
            </span>
          </th>
          <td>{total.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow
          data-testid="tranche-table-start"
          className="tranche-table__top-solid-border"
        >
          <th>{t("Starts unlocking")}</th>
          <td>{format(tranche.tranche_start, "dd/MM/yyyy")}</td>
        </KeyValueTableRow>
        <KeyValueTableRow
          data-testid="tranche-table-finish"
          className="tranche-table__no-borders"
        >
          <th>{t("Fully unlocked")}</th>
          <td>{format(tranche.tranche_end, "dd/MM/yyyy")}</td>
        </KeyValueTableRow>
        <KeyValueTableRow
          data-testid="tranche-table-locked"
          className="tranche-table__top-solid-border"
        >
          <th>{t("Locked")}</th>
          <td>{locked.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow data-testid="tranche-table-unlocked">
          <th>{t("Unlocked")}</th>
          <td>{vested.toString()}</td>
        </KeyValueTableRow>
      </KeyValueTable>
      <div className="tranche-table__footer" data-testid="tranche-table-footer">
        {trancheFullyLocked && (
          <div>
            {t(
              "All the tokens in this tranche are locked and can not be redeemed yet."
            )}
          </div>
        )}
        {!trancheFullyLocked && !redeemable && (
          <div>
            {t(
              "You must reduce your staked vesting tokens by at least {{amount}} to redeem from this tranche. Manage your stake or just dissociate your tokens.",
              { amount: reduceStakeAmount }
            )}
          </div>
        )}
        {!trancheFullyLocked && redeemable && (
          <button>
            {t("Redeem unlocked VEGA from tranche {{id}}", {
              id: tranche.tranche_id,
            })}
          </button>
        )}
      </div>
    </section>
  );
};
