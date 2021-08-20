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
  return (
    <section data-testid="tranche-table" className="tranche-table">
      <KeyValueTable numerical={true}>
        <KeyValueTableRow
          data-testid="tranche-table-total"
          className="tranche-table__no-borders"
        >
          {/* TODO Use tranche label */}
          <th>
            {t("Tranche")} {tranche.tranche_id}
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
    </section>
  );
};
