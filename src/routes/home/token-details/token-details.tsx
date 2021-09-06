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
          <a
            rel="noreferrer"
            target="_blank"
            href={"https://etherscan.io/address/" + ADDRESSES.vegaTokenAddress}
          >
            {truncateMiddle(ADDRESSES.vegaTokenAddress)}
          </a>
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Token contract")}</th>
        <td data-testid="token-contract">
          <a
            rel="noreferrer"
            target="_blank"
            href={"https://etherscan.io/address/" + ADDRESSES.vestingAddress}
          >
            {truncateMiddle(ADDRESSES.vestingAddress)}
          </a>
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
        <th>{t("Associated on Vega")}</th>
        <td data-testid="associated">
          {formatNumber(appState.totalAssociated)}
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Staked on Vega")}</th>
        <td data-testid="staked">{formatNumber(totalStaked)}</td>
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
