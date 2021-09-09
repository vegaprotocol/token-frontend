import React from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
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
    totalRewardsAvailable: string;
    rewardsBalance: string;
    stakedBalance: string;
    unstakedBalance: string;
    awardContractAddress: string;
    lpTokenTotalSupply: string;
  } | null>(null);

  React.useEffect(() => {
    const run = async () => {
      try {
        const promises = [
          await lpStaking.awardTokenTotalSupply(),
          await lpStaking.rewardsBalance(ethAddress),
          await lpStaking.stakedBalance(ethAddress),
          await lpStaking.totalUnstaked(ethAddress),
          await lpStaking.awardContractAddress(),
          await lpStaking.lpTokenTotalSupply(),
        ];
        const [
          totalRewardsAvailable,
          rewardsBalance,
          stakedBalance,
          unstakedBalance,
          awardContractAddress,
          lpTokenTotalSupply,
        ] = await Promise.all(promises);
        setValues({
          totalRewardsAvailable,
          rewardsBalance,
          stakedBalance,
          unstakedBalance,
          awardContractAddress,
          lpTokenTotalSupply,
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
    <section>
      <h3>{name}</h3>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>{t("liquidityTokenContractAddress")}</th>
          <td>
            <EtherscanLink
              chainId={appState.chainId}
              hash={contractAddress}
              text={truncateMiddle(contractAddress)}
            />
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("rewardPerEpoch")}</th>
          <td>{values.totalRewardsAvailable}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("rewardTokenContractAddress")}</th>
          <td>
            <EtherscanLink
              chainId={appState.chainId}
              hash={values.awardContractAddress}
              text={truncateMiddle(values.awardContractAddress)}
            />
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("liquidityTokenSupply")}</th>
          <td>{values.lpTokenTotalSupply}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </section>
  );
};
