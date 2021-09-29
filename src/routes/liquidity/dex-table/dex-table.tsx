import "./dex-table.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { EtherscanLink } from "../../../components/etherscan-link";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { Link } from "react-router-dom";
import { Routes } from "../../router-config";
import { LiquidityState, LiquidityAction } from "../liquidity-reducer";
import { Links, REWARDS_POOL_ADDRESSES } from "../../../config";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { EpochCountdown } from "../../../components/epoch-countdown";
import { format } from "date-fns";

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
    () => REWARDS_POOL_ADDRESSES[contractAddress],
    [contractAddress]
  );
  const stakingStartTime = React.useMemo(() => {
    return Number(values.stakingStart || 0) * 1000 + 1000 * 60 * 60 * 24;
  }, [values?.stakingStart]);
  if (!values) {
    return <p>{t("Loading")}...</p>;
  }

  return (
    <section className="dex-table">
      <h3>{name}</h3>
      {stakingStartTime > Date.now() / 1000 && (
        <p>
          If you have been providing liquidity on SushiSwap before the
          deployment of the staking contract, then your retroactive rewards will
          be displayed and redeemable after{" "}
          {format(new Date(stakingStartTime), "yyyy.MM.dd HH:mm")}
        </p>
      )}
      <KeyValueTable className="dex-tokens-section__table">
        <KeyValueTableRow>
          <th>{t("liquidityTokenSushiAddress")}</th>
          <td>
            <a
              target="_blank"
              rel="nofollow noreferrer"
              href={`${Links.SUSHI_PAIRS}/${poolAddress}`}
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
          <th>{t("slpTokenContractAddress")}</th>
          <td>
            <EtherscanLink
              chainId={appState.chainId}
              address={values.lpTokenContractAddress}
              text={values.lpTokenContractAddress}
            />
          </td>
        </KeyValueTableRow>
        {/* TODO: Re-add this row when APY calculation is correct */}
        {/* <KeyValueTableRow>
          <th>{t("lpTokensEstimateAPY")}</th>
          <td>{values.estimateAPY.decimalPlaces(2).toString()}%</td>
        </KeyValueTableRow> */}
        <KeyValueTableRow>
          <th>{t("lpTokensInRewardPool")}</th>
          <td>
            {values.rewardPoolBalance.toString()} {t("SLP")}
          </td>
        </KeyValueTableRow>
        {ethAddress ? (
          <ConnectedRows
            showInteractionButton={showInteractionButton}
            lpContractAddress={contractAddress}
            state={state}
          />
        ) : null}
      </KeyValueTable>
      <EpochCountdown
        startDate={new Date(values.epochDetails.startSeconds.toNumber() * 1000)}
        endDate={new Date(values.epochDetails.endSeconds.toNumber() * 1000)}
        id={values.epochDetails.id}
      />
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
  if (!values.connectedWalletData) {
    return null;
  }
  const {
    availableLPTokens,
    totalStaked,
    pendingStakedLPTokens,
    stakedLPTokens,
    shareOfPool,
    accumulatedRewards,
  } = values.connectedWalletData;
  // Only shows the Deposit/Withdraw button IF they have tokens AND they haven't staked AND we're not on the relevant page
  const isDepositButtonVisible =
    showInteractionButton &&
    availableLPTokens &&
    availableLPTokens.isGreaterThan(0);
  const hasDeposited = totalStaked.isGreaterThan(0);
  const hasRewards = accumulatedRewards.isGreaterThan(0);
  return (
    <>
      <KeyValueTableRow>
        <th>{t("usersLpTokens")}</th>
        <td>
          <div>
            {availableLPTokens.toString()}&nbsp;{t("SLP")}
          </div>
          {hasDeposited ? (
            <span className="text-muted">{t("alreadyDeposited")}</span>
          ) : isDepositButtonVisible ? (
            <div style={{ marginTop: 3 }}>
              <Link to={`${Routes.LIQUIDITY}/${lpContractAddress}/deposit`}>
                <button className="button-secondary">
                  {t("depositToRewardPoolButton")}
                </button>
              </Link>
            </div>
          ) : null}
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>
          {pendingStakedLPTokens.isGreaterThan(0)
            ? t("usersPendingStakeLPTokens")
            : t("usersStakedLPTokens")}
        </th>
        <td>
          {pendingStakedLPTokens?.isGreaterThan(0)
            ? pendingStakedLPTokens?.toString()
            : stakedLPTokens?.toString()}
          &nbsp;{t("SLP")}
        </td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("usersShareOfPool")}</th>
        <td>{shareOfPool.toString()}%</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <th>{t("usersAccumulatedRewards")}</th>
        <td>
          <div>
            {accumulatedRewards.toString()} {t("VEGA")}
          </div>
          {(hasDeposited || hasRewards) && (
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
