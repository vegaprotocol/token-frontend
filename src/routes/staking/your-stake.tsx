import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { StakeNode_party_delegations } from "./__generated__/StakeNode";

export interface YourStakeProps {
  currentEpoch: string;
  delegations: StakeNode_party_delegations[];
}

export const YourStake = ({ currentEpoch, delegations }: YourStakeProps) => {
  const { t } = useTranslation();

  const stakeThisEpoch = React.useMemo(() => {
    const amountsThisEpoch = delegations
      .filter((d) => d.epoch === Number(currentEpoch))
      .map((d) => new BigNumber(d.amount));
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amountsThisEpoch]);
  }, [delegations, currentEpoch]);

  const stakeNextEpoch = React.useMemo(() => {
    const amountsNextEpoch = delegations
      .filter((d) => d.epoch === Number(currentEpoch) + 1)
      .map((d) => new BigNumber(d.amount));
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amountsNextEpoch]);
  }, [delegations, currentEpoch]);

  return (
    <>
      <h2>{t("Your Stake")}</h2>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>{t("Your Stake On Node (This Epoch)")}</th>
          <td>{stakeThisEpoch}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("Your Stake On Node (Next Epoch)")}</th>
          <td>{stakeNextEpoch}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </>
  );
};
