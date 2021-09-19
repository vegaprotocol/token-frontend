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
import { useAddAssetToWallet } from "../../../hooks/use-add-asset-to-wallet";

const AddTokenTableCell = ({
  chainId,
  address,
  symbol,
  decimals,
  image,
  text,
}: {
  chainId: EthereumChainId;
  address: string;
  symbol: string;
  decimals: number;
  image: string;
  text: string;
}) => {
  const addToken = useAddAssetToWallet(address, symbol, decimals, image);
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
      <button className="button-link" onClick={addToken}>
        <img
          style={{
            width: 32,
            height: 32,
            border: "1px solid white",
            borderRadius: 2,
          }}
          alt="token-logo"
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
        />
      </button>
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
