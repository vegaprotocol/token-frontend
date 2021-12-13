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
import { useTranches } from "../../../hooks/use-tranches";

export const TokenDetails = ({
  totalSupply,
  totalStaked,
}: {
  totalSupply: BigNumber;
  totalStaked: BigNumber;
}) => {
  const { t } = useTranslation();

  const tranches = useTranches();
  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td data-testid="token-address">
          <EtherscanLink
            address={ADDRESSES.vegaTokenAddress}
            text={ADDRESSES.vegaTokenAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Vesting contract")}</th>
        <td data-testid="token-contract">
          <EtherscanLink
            address={ADDRESSES.vestingAddress}
            text={ADDRESSES.vestingAddress}
          />
        </td>
      </KeyValueTableRow>
      {Flags.VESTING_DISABLED ? null : (
        <>
          <KeyValueTableRow>
            <th>{t("Total supply")}</th>
            <td data-testid="total-supply">{formatNumber(totalSupply, 2)}</td>
          </KeyValueTableRow>
          <KeyValueTableRow>
            <th>{t("Circulating supply")}</th>
            <TokenDetailsCirculating tranches={tranches} />
          </KeyValueTableRow>
        </>
      )}
      <KeyValueTableRow>
        <th>{t("Staked on Vega validator")}</th>
        <td data-testid="staked">{formatNumber(totalStaked, 2)}</td>
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
