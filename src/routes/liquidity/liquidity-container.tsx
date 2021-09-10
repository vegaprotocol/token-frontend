import "./liquidity-container.scss";
import React from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { REWARDS_ADDRESSES } from "../../config";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";
import { EtherscanLink } from "../../components/etherscan-link";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import { IVegaLPStaking } from "../../lib/web3-utils";
import { BigNumber } from "../../lib/bignumber";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";

const BLOG_LINK =
  "https://blog.vega.xyz/unlocking-vega-coinlist-pro-uniswap-sushiswap-b1414750e358";

export const LiquidityContainer = () => {
  const { t } = useTranslation();
  const { ethAddress } = useEthUser();

  return (
    <>
      <p>{t("liquidityIntro")}</p>
      <p>
        {t("liquidityIntroInstructionsLink")}.&nbsp;
        <a href={BLOG_LINK} rel="nofollow noreferrer">
          {t("liquidityIntroInstructionsLink")}
        </a>
        .
      </p>
      {!ethAddress && <EthConnectPrompt />}
      <h2>{t("liquidityRewardsTitle")}</h2>
      {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
        return (
          <DexTokensSection
            key={name}
            name={name}
            contractAddress={contractAddress}
            ethAddress={ethAddress}
          />
        );
      })}
    </>
  );
};

interface DexTokensSectionProps {
  name: string;
  contractAddress: string;
  ethAddress: string;
}

const DexTokensSection = ({
  name,
  contractAddress,
  ethAddress,
}: DexTokensSectionProps) => {
  const { appState } = useAppState();
  const { t } = useTranslation();
  const lpStaking = useVegaLPStaking({ address: contractAddress });

  const [values, setValues] = React.useState<{
    rewardPerEpoch: string;
    awardContractAddress: string;
    rewardPoolBalance: string;
  } | null>(null);

  React.useEffect(() => {
    const run = async () => {
      try {
        const promises = [
          await lpStaking.rewardPerEpoch(),
          await lpStaking.awardContractAddress(),
          await lpStaking.liquidityTokensInRewardPool(),
        ];
        const [rewardPerEpoch, awardContractAddress, rewardPoolBalance] =
          await Promise.all(promises);
        setValues({
          rewardPerEpoch,
          awardContractAddress,
          rewardPoolBalance,
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);

  if (values === null) {
    return <p>{t("Loading")}...</p>;
  }

  return (
    <section className="dex-tokens-section">
      <h3>{name}</h3>
      <table className="dex-tokens-section__table">
        <tbody>
          <tr>
            <th>{t("liquidityTokenContractAddress")}</th>
            <td>
              <EtherscanLink
                chainId={appState.chainId}
                hash={contractAddress}
                text={truncateMiddle(contractAddress)}
              />
            </td>
          </tr>
          <tr>
            <th>{t("rewardPerEpoch")}</th>
            <td>{values.rewardPerEpoch} VEGA</td>
          </tr>
          <tr>
            <th>{t("rewardTokenContractAddress")}</th>
            <td>
              <EtherscanLink
                chainId={appState.chainId}
                hash={values.awardContractAddress}
                text={truncateMiddle(values.awardContractAddress)}
              />
            </td>
          </tr>
          <tr>
            <th>{t("lpTokensInRewardPool")}</th>
            <td>{values.rewardPoolBalance}</td>
          </tr>
          {ethAddress && (
            <ConnectedRows
              lpContractAddress={contractAddress}
              ethAddress={ethAddress}
              lpStaking={lpStaking}
              rewardPoolBalance={values.rewardPoolBalance}
            />
          )}
        </tbody>
      </table>
    </section>
  );
};

interface ConnectedRowsProps {
  lpContractAddress: string;
  ethAddress: string;
  lpStaking: IVegaLPStaking;
  rewardPoolBalance: string;
}

const ConnectedRows = ({
  lpContractAddress,
  ethAddress,
  lpStaking,
  rewardPoolBalance,
}: ConnectedRowsProps) => {
  const { t } = useTranslation();
  const [values, setValues] = React.useState<{
    availableLPTokens: string;
    stakedLPTokens: string;
    shareOfPool: string;
    accumulatedRewards: string;
  } | null>(null);

  React.useEffect(() => {
    const run = async () => {
      const availableLPTokens = await lpStaking.totalUnstaked(ethAddress);
      const stakedLPTokens = await lpStaking.stakedBalance(ethAddress);
      // TODO: check that this is correct, I think we are meant to be summing a few
      // values here?
      const accumulatedRewards = await lpStaking.rewardsBalance(ethAddress);

      const rewardPool = new BigNumber(rewardPoolBalance);
      const shareOfPool = new BigNumber(stakedLPTokens)
        .dividedBy(rewardPool)
        .times(100)
        .toString();

      setValues({
        availableLPTokens,
        stakedLPTokens,
        shareOfPool,
        accumulatedRewards,
      });
    };

    run();
  }, [ethAddress, lpStaking, rewardPoolBalance]);

  if (values === null) {
    return null;
  }

  return (
    <>
      <tr>
        <th>{t("usersLpTokens")}</th>
        <td>
          <div>{values.availableLPTokens}</div>
          {new BigNumber(values.stakedLPTokens).isGreaterThan(0) ? (
            <span className="text-muted">{t("alreadyDeposited")}</span>
          ) : (
            <div style={{ marginTop: 3 }}>
              <Link to={`${Routes.LIQUIDITY}/${lpContractAddress}/deposit`}>
                <button>{t("depositToRewardPoolButton")}</button>
              </Link>
            </div>
          )}
        </td>
      </tr>
      <tr>
        <th>{t("usersStakedLPTokens")}</th>
        <td>{values.stakedLPTokens}</td>
      </tr>
      <tr>
        <th>{t("usersShareOfPool")}</th>
        <td>{values.shareOfPool}</td>
      </tr>
      <tr>
        <th>{t("usersAccumulatedRewards")}</th>
        <td>
          <div>{values.accumulatedRewards} VEGA</div>
          {/* // TODO: check this condition is correct */}
          {new BigNumber(values.stakedLPTokens).isGreaterThan(0) && (
            <div style={{ marginTop: 3 }}>
              <Link to={`${Routes.LIQUIDITY}/${lpContractAddress}/withdraw`}>
                <button>{t("withdrawFromRewardPoolButton")}</button>
              </Link>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};
