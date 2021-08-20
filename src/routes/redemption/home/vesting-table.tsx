import "./vesting-table.scss";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { BigNumber } from "../../../lib/bignumber";
import React from "react";
import { useTranslation } from "react-i18next";

export interface VestingTableProps {
  vested: BigNumber;
  locked: BigNumber;
  staked: BigNumber;
}

export const VestingTable = ({ vested, locked, staked }: VestingTableProps) => {
  const { t } = useTranslation();
  const total = React.useMemo(() => {
    return vested.plus(locked);
  }, [locked, vested]);
  const vestedPercentage = React.useMemo(() => {
    return vested.div(total).times(100);
  }, [total, vested]);
  const lockedPercentage = React.useMemo(() => {
    return locked.div(total).times(100);
  }, [total, locked]);
  const stakedPercentage = React.useMemo(() => {
    return staked.div(total).times(100);
  }, [total, staked]);
  return (
    <section data-testid="vesting-table" className="vesting-table">
      <KeyValueTable numerical={true}>
        <KeyValueTableRow
          data-testid="vesting-table-total"
          className="vesting-table__top-solid-border"
        >
          <th>{t("Vesting VEGA")}</th>
          <td>{total.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow
          data-testid="vesting-table-locked"
          className="vesting-table__no-borders"
        >
          <th>{t("Locked")}</th>
          <td>{locked.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow
          data-testid="vesting-table-unlocked"
          className="vesting-table__no-borders"
        >
          <th>{t("Unlocked")}</th>
          <td>{vested.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow
          data-testid="vesting-table-staked"
          className="vesting-table__top-dashed-border"
        >
          <th>{t("Staked")}</th>
          <td>{staked.toString()}</td>
        </KeyValueTableRow>
      </KeyValueTable>
      <div className="vesting-table__progress-bar">
        <div
          className="vesting-table__progress-bar--locked"
          style={{ flex: lockedPercentage.toNumber() }}
        ></div>
        <div
          className="vesting-table__progress-bar--vested"
          style={{ flex: vestedPercentage.toNumber() }}
        ></div>
      </div>
      <div className="vesting-table__progress-bar vesting-table__progress-bar--small">
        <div
          className="vesting-table__progress-bar--staked"
          style={{ flex: stakedPercentage.toNumber() }}
        ></div>
        <div
          className="vesting-table__progress-bar"
          style={{
            flex: new BigNumber(100).minus(stakedPercentage).toNumber(),
          }}
        ></div>
      </div>
    </section>
  );
};
