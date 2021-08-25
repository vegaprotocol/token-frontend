import "./validator-table.scss";
import React from 'react'
import { useTranslation } from 'react-i18next';

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";

export interface ValidatorTableProps {
  node: string
}

export const ValidatorTable = ({ node }: ValidatorTableProps) => {
  const { t } = useTranslation();

  // TODO get validator data based on the node
  const validator = {
    address: "aecfd920cbadbe1c5040a989fabb765bbc6685f4825de8b6a9cff98919dc3a89",
    about: "VEGANODZ.COM",
    ip: "192.168.1.1",
    totalStake: "3000.00",
    stakeShare: "23.02%",
    ownStake: "3000.00",
    nominated: "0.00",
  };

  return (
    <>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>{t("VEGA ADDRESS / PUBLIC KEY")}</th>
          <td className="validator-table__cell">{validator.address}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("ABOUT THIS VALIDATOR")}</th>
          <td>{validator.about}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("IP ADDRESS")}</th>
          <td>{validator.ip}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("TOTAL STAKE")}</th>
          <td>{validator.totalStake}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("STAKE SHARE")}</th>
          <td>{validator.stakeShare}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("OWN STAKE (THIS EPOCH)")}</th>
          <td>{validator.ownStake}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("NOMINATED (THIS EPOCH)")}</th>
          <td>{validator.nominated}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </>
  );
};