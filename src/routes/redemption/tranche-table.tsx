import "./tranche-table.scss";

import { Trans, useTranslation } from "react-i18next";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { BigNumber } from "../../lib/bignumber";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export interface TrancheTableProps {
  tranche: {
    tranche_id: number;
    tranche_start: Date;
    tranche_end: Date;
  };
  locked: BigNumber;
  vested: BigNumber;
  lien: BigNumber;
  totalVested: BigNumber;
  totalLocked: BigNumber;
  onClick: () => void;
  disabled?: boolean;
}

export const TrancheTable = ({
  tranche,
  locked,
  vested,
  lien,
  onClick,
  totalVested,
  totalLocked,
  disabled = false,
}: TrancheTableProps) => {
  const { t } = useTranslation();
  const total = vested.plus(locked);
  const trancheFullyLocked =
    tranche.tranche_start.getTime() > new Date().getTime();
  const totalAllTranches = totalVested.plus(totalLocked);
  const unstaked = totalAllTranches.minus(lien);
  const reduceAmount = vested.minus(BigNumber.max(unstaked, 0));
  const redeemable = reduceAmount.isLessThanOrEqualTo(0);

  let message = null;
  if (trancheFullyLocked || vested.isEqualTo(0)) {
    message = (
      <div>
        {t(
          "All the tokens in this tranche are locked and can not be redeemed yet."
        )}
      </div>
    );
  } else if (!trancheFullyLocked && !redeemable) {
    message = (
      <div>
        <Trans
          i18nKey="You must reduce your associated vesting tokens by at least {{amount}} to redeem from this tranche. <stakeLink>Manage your stake</stakeLink> or just <disassociateLink>dissociate your tokens</disassociateLink>."
          values={{
            amount: reduceAmount,
          }}
          components={{
            stakeLink: <Link to={`/staking`} />,
            disassociateLink: <Link to={`/staking/disassociate`} />,
          }}
        />
      </div>
    );
  } else if (!trancheFullyLocked && redeemable) {
    message = (
      <button onClick={onClick} disabled={disabled}>
        {t("Redeem unlocked VEGA from tranche {{id}}", {
          id: tranche.tranche_id,
        })}
      </button>
    );
  }
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
        {message}
      </div>
    </section>
  );
};
