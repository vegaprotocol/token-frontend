import "./token-details.scss";

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TokenDetailsCirculating } from "./token-details-circulating";
import { truncateMiddle } from "../../../lib/truncate-middle";
import { ADDRESSES, EthereumChainId } from "../../../config";
import { formatNumber } from "../../../lib/format-number";
import { BigNumber } from "../../../lib/bignumber";
import { EtherscanLink } from "../../../components/etherscan-link";
import { AddTokenButton } from "../../../components/add-token-button";

const AddTokenTableCell = ({
  chainId,
  address,
  symbol,
  decimals,
  image,
  text,
  buttonImage,
}: {
  chainId: EthereumChainId;
  address: string;
  symbol: string;
  decimals: number;
  image: string;
  buttonImage: string;
  text: string;
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginRight: 6,
        }}
      >
        <EtherscanLink chainId={chainId} address={address} text={text} />
      </div>
      <AddTokenButton
        address={address}
        symbol={symbol}
        decimals={decimals}
        image={image}
        buttonImage={buttonImage}
      />
    </div>
  );
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

  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td data-testid="token-address">
          <AddTokenTableCell
            chainId={appState.chainId}
            decimals={18}
            address={ADDRESSES.vegaTokenAddress}
            symbol="$VEGA"
            image="https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
            text={truncateMiddle(ADDRESSES.vegaTokenAddress)}
            buttonImage="https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Vesting contract")}</th>
        <td data-testid="token-contract">
          <AddTokenTableCell
            chainId={appState.chainId}
            decimals={18}
            address={ADDRESSES.lockedAddress}
            symbol="VEGA-Locked"
            image="https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
            text={truncateMiddle(ADDRESSES.vestingAddress)}
            buttonImage="https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
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
