import "./token-details.scss";

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TokenDetailsCirculating } from "./token-details-circulating";
import { truncateMiddle } from "../../../lib/truncate-middle";
import { ADDRESSES } from "../../../config";
import { formatNumber } from "../../../lib/format-number";
import { BigNumber } from "../../../lib/bignumber";
import { EtherscanLink } from "../../../components/etherscan-link";
import React from "react";

const useAddToWallet = (
  address: string,
  symbol: string,
  decimals: number,
  image: string
) => {
  const { provider } = useAppState();
  return React.useCallback(async () => {
    try {
      const wasAdded = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address,
            symbol,
            decimals,
            image,
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [address, decimals, image, provider, symbol]);
};

export const TokenDetails = ({
  totalSupply,
  totalStaked,
}: {
  totalSupply: BigNumber;
  totalStaked: BigNumber;
}) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const addToken = useAddToWallet(
    ADDRESSES.vegaTokenAddress,
    "$VEGA",
    18,
    "https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
  );

  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td data-testid="token-address">
          <EtherscanLink
            chainId={appState.chainId}
            address={ADDRESSES.vegaTokenAddress}
            text={truncateMiddle(ADDRESSES.vegaTokenAddress)}
          />
          &nbsp;
          <button className="button-link" onClick={addToken}>
            + Add to wallet
          </button>
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Vesting contract")}</th>
        <td data-testid="token-contract">
          <EtherscanLink
            chainId={appState.chainId}
            address={ADDRESSES.vestingAddress}
            text={truncateMiddle(ADDRESSES.vestingAddress)}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Total supply")}</th>
        <td data-testid="total-supply">{formatNumber(totalSupply)}</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Circulating supply")}</th>
        <TokenDetailsCirculating tranches={appState.tranches} />
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th style={{ whiteSpace: "nowrap" }}>
          {t("$VEGA associated with a Vega key")}
        </th>
        <td data-testid="associated">
          {formatNumber(appState.totalAssociated)}
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Staked on Vega validator")}</th>
        <td data-testid="staked">{formatNumber(totalStaked)}</td>
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
