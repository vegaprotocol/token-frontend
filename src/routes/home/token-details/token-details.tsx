import "./token-details.scss";

import { ADDRESSES, EthereumChainId, Flags } from "../../../config";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";

import { BigNumber } from "../../../lib/bignumber";
import { EtherscanLink } from "../../../components/etherscan-link";
import { TokenDetailsCirculating } from "./token-details-circulating";
import { formatNumber } from "../../../lib/format-number";
import { useTranslation } from "react-i18next";
import { useWeb3 } from "../../../contexts/web3-context/web3-context";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { useTranches } from "../../../hooks/use-tranches";
import { AddTokenButton } from "../../../components/add-token-button";
import vegaVesting from "../../../images/vega_vesting.png";
import vegaWhite from "../../../images/vega_white.png";

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

  const { chainId } = useWeb3();
  const { appState } = useAppState();
  const tranches = useTranches();
  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td data-testid="token-address">
          <AddTokenTableCell
            chainId={chainId}
            decimals={18}
            address={ADDRESSES.vegaTokenAddress}
            symbol="VEGA"
            image={vegaWhite}
            text={ADDRESSES.vegaTokenAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Vesting contract")}</th>
        <td data-testid="token-contract">
          <AddTokenTableCell
            chainId={chainId}
            decimals={18}
            address={ADDRESSES.vegaTokenAddress}
            symbol="VEGA🔒"
            image={vegaVesting}
            text={ADDRESSES.vestingAddress}
          />
        </td>
      </KeyValueTableRow>
      {Flags.VESTING_DISABLED ? null : (
        <>
          <KeyValueTableRow>
            <th>{t("Total supply")}</th>
            <td data-testid="total-supply">{formatNumber(totalSupply)}</td>
          </KeyValueTableRow>
          <KeyValueTableRow>
            <th>{t("Circulating supply")}</th>
            <TokenDetailsCirculating tranches={tranches} />
          </KeyValueTableRow>
        </>
      )}
      {Flags.STAKING_DISABLED ? null : (
        <KeyValueTableRow>
          <th>{t("vegaAssociatedWithKey", { symbol: "$VEGA" })}</th>
          <td data-testid="associated">
            {formatNumber(appState.totalAssociated, 2)}
          </td>
        </KeyValueTableRow>
      )}
      {Flags.STAKING_DISABLED ? null : (
        <KeyValueTableRow>
          <th>{t("Staked on Vega validator")}</th>
          <td data-testid="staked">{formatNumber(totalStaked, 2)}</td>
        </KeyValueTableRow>
      )}
    </KeyValueTable>
  );
};
