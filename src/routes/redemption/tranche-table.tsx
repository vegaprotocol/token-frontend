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
  locked: BigNumber;
  vested: BigNumber;
  lien: BigNumber;
  onClick: () => void;
}

export const TrancheTable = ({
  tranche,
  locked,
  vested,
  lien,
  onClick,
}: TrancheTableProps) => {
  const { t } = useTranslation();
  const total = vested.plus(locked);
  const trancheFullyLocked =
    tranche.tranche_start.getTime() > new Date().getTime();
  const unstaked = total.minus(lien);
  const reduceAmount = vested.minus(BigNumber.max(unstaked, 0));
  const redeemable = reduceAmount.isLessThanOrEqualTo(0);
  return (
    <section data-testid="tranche-table" className="tranche-table">
      <KeyValueTable numerical={true}>
        <KeyValueTableRow data-testid="tranche-table-total">
          <th>
            <span className="tranche-table__label">
              {t("Tranche")} {tranche.tranche_id}
            </span>
          </th>
          <td>{total.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow data-testid="tranche-table-start">
          <th>{t("Starts unlocking")}</th>
          <td>{format(tranche.tranche_start, "dd/MM/yyyy")}</td>
        </KeyValueTableRow>
        <KeyValueTableRow data-testid="tranche-table-finish">
          <th>{t("Fully unlocked")}</th>
          <td>{format(tranche.tranche_end, "dd/MM/yyyy")}</td>
        </KeyValueTableRow>
        <KeyValueTableRow data-testid="tranche-table-locked">
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
              { amount: reduceAmount }
            )}
          </div>
        )}
        {!trancheFullyLocked && redeemable && (
          <button onClick={onClick}>
            {t("Redeem unlocked VEGA from tranche {{id}}", {
              id: tranche.tranche_id,
            })}
          </button>
        )}
      </div>
    </section>
  );
};
