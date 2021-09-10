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

const BLOG_LINK =
  "https://blog.vega.xyz/unlocking-vega-coinlist-pro-uniswap-sushiswap-b1414750e358";

export const LiquidityContainer = () => {
  const { t } = useTranslation();
  const { ethAddress } = useEthUser();

  if (!ethAddress) {
    return <EthConnectPrompt />;
  }

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
            <td>{values.rewardPerEpoch}</td>
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
        </tbody>
      </table>
    </section>
  );
};
