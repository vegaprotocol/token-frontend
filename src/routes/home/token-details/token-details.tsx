import "./token-details.scss";

import { ADDRESSES, Flags } from "../../../config";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";

import { BigNumber } from "../../../lib/bignumber";
import { EtherscanLink } from "../../../components/etherscan-link";
import { TokenDetailsCirculating } from "./token-details-circulating";
import { formatNumber } from "../../../lib/format-number";
import { useTranslation } from "react-i18next";
import { useWeb3 } from "../../../contexts/web3/web3-context";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { useTranches } from "../../../hooks/use-tranches";

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
          <EtherscanLink
            chainId={chainId}
            address={ADDRESSES.vegaTokenAddress}
            text={ADDRESSES.vegaTokenAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Vesting contract")}</th>
        <td data-testid="token-contract">
          <EtherscanLink
            chainId={chainId}
            address={ADDRESSES.vestingAddress}
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
          <th>{t("$VEGA associated with a Vega key")}</th>
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
