import "./token-details.scss"

import React from "react";

import { KeyValueTable, KeyValueTableRow } from "../key-value-table";
import { useTranslation } from "react-i18next";
import {useAppState} from "../../contexts/app-state/app-state-context";

export const TokenDetails = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td>{appState.contractAddresses.vegaTokenAddress}</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Token contract")}</th>
        <td>{appState.contractAddresses.vestingAddress}</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Total supply")}</th>
        <td>123</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Circulating supply")}</th>
        <td>123</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Staked on Vega")}</th>
        <td>123</td>
      </KeyValueTableRow>
    </KeyValueTable>)
}
