import "./validator-table.scss";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { BigNumber } from "../../lib/bignumber";
import { Staking_nodes } from "./__generated__/Staking";

export interface ValidatorTableProps {
  node: Staking_nodes;
  stakedTotal: string;
  stakeThisEpoch: BigNumber;
}

export const ValidatorTable = ({
  node,
  stakedTotal,
  stakeThisEpoch,
}: ValidatorTableProps) => {
  const { t } = useTranslation();

  const stakePercentage = React.useMemo(() => {
    const total = new BigNumber(stakedTotal);
    const stakedOnNode = new BigNumber(node.stakedTotal);
    const stakedTotalPercentage =
      total.isEqualTo(0) || stakedOnNode.isEqualTo(0)
        ? "-"
        : stakedOnNode.dividedBy(total).times(100).toString() + "%";
    return stakedTotalPercentage;
  }, [node.stakedTotal, stakedTotal]);

  return (
    <>
      <KeyValueTable data-testid="validator-table">
        <KeyValueTableRow>
          <th>{t("VEGA ADDRESS / PUBLIC KEY")}</th>
          <td className="validator-table__cell">{node.pubkey}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("ABOUT THIS VALIDATOR")}</th>
          <td>{node.infoUrl}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("IP ADDRESS")}</th>
          <td>{node.location}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("TOTAL STAKE")}</th>
          <td>{node.stakedTotal}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("STAKE SHARE")}</th>
          <td>{stakePercentage}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("OWN STAKE (THIS EPOCH)")}</th>
          <td>{stakeThisEpoch}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("NOMINATED (THIS EPOCH)")}</th>
          <td>{node.stakedByDelegates}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </>
  );
};
