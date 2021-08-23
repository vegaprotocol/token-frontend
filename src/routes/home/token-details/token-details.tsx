import "./token-details.scss";

import React from "react";

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../../contexts/app-state/app-state-context";
import { TokenDetailsTotal } from "./token-details-total";
import { EtherscanLink } from "../../../components/etherscan-link";
import { TokenDetailsStaked } from "./token-details-staked";
import { TokenDetailsCirculating } from "./token-details-circulating";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { Decimals } from "../../../lib/web3-utils";

export const TokenDetails = () => {
  const { t } = useTranslation();

  const { appState, appDispatch } = useAppState();

  const vesting = useVegaVesting();

  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: "SET_TRANCHES", tranches });
    };

    run();
  }, [appDispatch, vesting]);

  const decimals = Decimals[appState.chainId!];

  return (
    <KeyValueTable className={"token-details"}>
      <KeyValueTableRow>
        <th>{t("Token address")}</th>
        <td>
          <EtherscanLink
            chainId={appState.chainId || "0x1"}
            hash={appState.contractAddresses.vegaTokenAddress}
            text={appState.contractAddresses.vegaTokenAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Token contract")}</th>
        <td>
          <EtherscanLink
            chainId={appState.chainId || "0x1"}
            hash={appState.contractAddresses.vestingAddress}
            text={appState.contractAddresses.vestingAddress}
          />
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Total supply")}</th>
        <TokenDetailsTotal
          totalSupplyFormatted={appState.totalSupplyFormatted}
        />
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Circulating supply")}</th>
        <TokenDetailsCirculating
          tranches={appState.tranches}
          decimals={decimals}
        />
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("Staked on Vega")}</th>
        <TokenDetailsStaked />
      </KeyValueTableRow>
    </KeyValueTable>
  );
};
