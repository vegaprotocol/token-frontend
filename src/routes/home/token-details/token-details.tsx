import "./token-details.scss";

import React from "react";

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { EtherscanLink } from "../../../components/etherscan-link";
import { TokenDetailsCirculating } from "./token-details-circulating";
import { EthereumChainIds } from "../../../lib/web3-utils";

export const TokenDetails = ({ totalSupply }: { totalSupply: string }) => {
  const { t } = useTranslation();

  const { appState } = useAppState();

  const chainId = appState.chainId || EthereumChainIds.Mainnet;

  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td data-testid="token-address">
          <EtherscanLink
            chainId={chainId}
            hash={appState.contractAddresses.vegaTokenAddress}
            text={appState.contractAddresses.vegaTokenAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Token contract")}</th>
        <td data-testid="token-contract">
          <EtherscanLink
            chainId={chainId}
            hash={appState.contractAddresses.vestingAddress}
            text={appState.contractAddresses.vestingAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Total supply")}</th>
        <td data-testid="total-supply">{totalSupply}</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Circulating supply")}</th>
        <TokenDetailsCirculating
          tranches={appState.tranches}
          decimals={appState.decimals}
        />
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Staked on Vega")}</th>
        <td data-testid="staked">{appState.totalStakedFormatted}</td>
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
