import "./token-details.scss"

import React from "react";

import { KeyValueTable, KeyValueTableRow } from "../key-value-table";
import { useTranslation } from "react-i18next";
import {useAppState} from "../../contexts/app-state/app-state-context";
import {TokenDetailsTotal} from "./token-details-total";
import {EtherscanLink} from "../etherscan-link";
import {TokenDetailsStaked} from "./token-details-staked";
import {TokenDetailsCirculating} from "./token-details-circulating";

export const TokenDetails = () => {
  const { t } = useTranslation();

  const { appState } = useAppState();

  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td><EtherscanLink chainId={appState.chainId || "0x1"} hash={appState.contractAddresses.vegaTokenAddress} text={appState.contractAddresses.vegaTokenAddress} /></td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Token contract")}</th>
        <td><EtherscanLink chainId={appState.chainId || "0x1"} hash={appState.contractAddresses.vestingAddress} text={appState.contractAddresses.vestingAddress} /></td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Total supply")}</th>
        <TokenDetailsTotal totalSupplyFormatted={appState.totalSupplyFormatted} />
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Circulating supply")}</th>
        <TokenDetailsCirculating />
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Staked on Vega")}</th>
        <TokenDetailsStaked />
      </KeyValueTableRow>
    </KeyValueTable>)
}
