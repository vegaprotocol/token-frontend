import "./liquidity-container.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { EtherscanLink } from "../../components/etherscan-link";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";
import { LiquidityState, LiquidityAction } from "./liquidity-reducer";
import { REWARDS_POOL_ADDRESSES } from "../../config";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";

const BASE_SUSHI_URL = "https://analytics.sushi.com/pairs/";
interface DexTokensSectionProps {
  name: string;
  contractAddress: string;
  ethAddress: string;
  state: LiquidityState;
  dispatch: React.Dispatch<LiquidityAction>;
  showInteractionButton?: boolean;
}

export const DexTokensSection = ({
  name,
  contractAddress,
  ethAddress,
  state,
  showInteractionButton = true,
}: DexTokensSectionProps) => {
  const { appState } = useAppState();
  const { t } = useTranslation();
  const values = React.useMemo(
    () => state.contractData[contractAddress],
    [contractAddress, state.contractData]
  );
  const poolAddress = React.useMemo<string>(
    // TODO how to fix this?
    // @ts-ignore
    () => REWARDS_POOL_ADDRESSES[contractAddress],
    [contractAddress]
  );
  if (!values) {
    return <p>{t("Loading")}...</p>;
  }

  return (
    <section className="dex-tokens-section">
      <h3>{name}</h3>
      <KeyValueTable numerical={true}>
        <KeyValueTableRow>
          <th>{t("liquidityTokenSushiAddress")}</th>
          <td>
            <a
              target="_blank"
              rel="nofollow noreferrer"
              href={`${BASE_SUSHI_URL}/${poolAddress}`}
            >
              {poolAddress}
            </a>
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("liquidityTokenContractAddress")}</th>
          <td>
            <EtherscanLink
              chainId={appState.chainId}
              address={contractAddress}
              text={contractAddress}
            />
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("rewardPerEpoch")}</th>
          <td>
            {values.rewardPerEpoch.toString()} {t("VEGA")}
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("rewardTokenContractAddress")}</th>
          <td>
            <EtherscanLink
              chainId={appState.chainId}
              address={values.awardContractAddress}
              text={values.awardContractAddress}
            />
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("lpTokensEstimateAPY")}</th>
          <td>{values.estimateAPY.decimalPlaces(2).toString()}%</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("lpTokensInRewardPool")}</th>
          <td>{values.rewardPoolBalance.toString()}</td>
        </KeyValueTableRow>
        {ethAddress && (
          <ConnectedRows
            showInteractionButton={showInteractionButton}
            lpContractAddress={contractAddress}
            state={state}
          />
        )}
      </KeyValueTable>
    </section>
  );
};

interface ConnectedRowsProps {
  lpContractAddress: string;
  state: LiquidityState;
  showInteractionButton: boolean;
}

const ConnectedRows = ({
  lpContractAddress,
  state,
  showInteractionButton = true,
}: ConnectedRowsProps) => {
  const { t } = useTranslation();
  const values = React.useMemo(
    () => state.contractData[lpContractAddress],
    [lpContractAddress, state.contractData]
  );

  // Only shows the Deposit/Withdraw button IF they have tokens AND they haven't staked AND we're not on the relevant page
  const isDepositButtonVisible =
    showInteractionButton &&
    values.availableLPTokens &&
    values.availableLPTokens.isGreaterThan(0);
  const hasDeposited =
    values.stakedLPTokens?.isGreaterThan(0) ||
    values.pendingStakedLPTokens?.isGreaterThan(0);
  return (
    <>
      <KeyValueTableRow>
        <th>{t("usersLpTokens")}</th>
        <td>
          <div>{values.availableLPTokens?.toString()}</div>
          {hasDeposited ? (
            <span className="text-muted">{t("alreadyDeposited")}</span>
          ) : isDepositButtonVisible ? (
            <div style={{ marginTop: 3 }}>
              <Link to={`${Routes.LIQUIDITY}/${lpContractAddress}/deposit`}>
                <button
                  className="butt
                on-secondary"
                >
                  {t("depositToRewardPoolButton")}
                </button>
              </Link>
            </div>
          ) : null}
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>
          {values.pendingStakedLPTokens?.isGreaterThan(0)
            ? t("usersPendingStakeLPTokens")
            : t("usersStakedLPTokens")}
        </th>
        <td>
          {values.pendingStakedLPTokens?.isGreaterThan(0)
            ? values.pendingStakedLPTokens?.toString()
            : values.stakedLPTokens?.toString()}
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("usersShareOfPool")}</th>
        <td>{values.shareOfPool?.toString()}%</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("usersAccumulatedRewards")}</th>
        <td>
          <div>
            {values.accumulatedRewards?.toString()} {t("VEGA")}
          </div>
          {hasDeposited && (
            <div style={{ marginTop: 3 }}>
              <Link to={`${Routes.LIQUIDITY}/${lpContractAddress}/withdraw`}>
                <button className="button-secondary">
                  {t("withdrawFromRewardPoolButton")}
                </button>
              </Link>
            </div>
          )}
        </td>
      </KeyValueTableRow>
    </>
  );
};
