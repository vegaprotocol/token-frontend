import "./dex-rewards-list.scss";
import React from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { EtherscanLink } from "../../components/etherscan-link";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { REWARDS_ADDRESSES } from "../../config";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";
import { DexRewardsList } from "./dex-rewards-list";
import { DexTokensStaked } from "./dex-tokens-staked";
import { DexTokensUnstaked } from "./dex-tokens-unstaked";
import { truncateMiddle } from "../../lib/truncate-middle";

// are here in case we have to do that.
const DISABLE_EARNING = false;
const DISABLE_CONNECTED = false;

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
      <table className="dex-rewards-list-table key-value-table">
        <thead className="key-value-table__header">
          <tr>
            <th>{t("liquidityTotalAvailableRewardsToken")}</th>
            <th>{t("liquidityTotalAvailableAddress")}</th>
            <th>{t("liquidityTotalAvailableRewards")}</th>
            <th>{t("liquidityStakedBalance")}</th>
            <th>{t("liquidityStakedRewards")}</th>
            <th>{t("liquidityTokenBalance")}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
            return (
              <DexRewardsTableRow
                key={name}
                name={name}
                contractAddress={contractAddress}
                ethAddress={ethAddress}
              />
            );
          })}
        </tbody>
      </table>
      {/* <DexRewardsList />
      {DISABLE_EARNING ? null : <DexTokensStaked ethAddress={ethAddress} />}
      {DISABLE_CONNECTED ? null : <DexTokensUnstaked ethAddress={ethAddress} />} */}
    </>
  );
};

interface DexRewardsProps {
  name: string;
  contractAddress: string;
  ethAddress: string;
}

const DexRewardsTableRow = ({
  name,
  contractAddress,
  ethAddress,
}: DexRewardsProps) => {
  const { t } = useTranslation();
  const {
    appState: { chainId },
  } = useAppState();
  const lpStaking = useVegaLPStaking({ address: contractAddress });

  const [values, setValues] = React.useState<{
    totalRewardsAvailable: string;
    rewardsBalance: string;
    stakedBalance: string;
    unstakedBalance: string;
  } | null>(null);

  React.useEffect(() => {
    const run = async () => {
      try {
        const [
          totalRewardsAvailable,
          rewardsBalance,
          stakedBalance,
          unstakedBalance,
        ] = await Promise.all([
          await lpStaking.awardTokenTotalSupply(),
          await lpStaking.rewardsBalance(ethAddress),
          await lpStaking.stakedBalance(ethAddress),
          await lpStaking.totalUnstaked(ethAddress),
        ]);
        setValues({
          totalRewardsAvailable,
          rewardsBalance,
          stakedBalance,
          unstakedBalance,
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);

  if (values === null) {
    return (
      <tr>
        <td>{t("Loading")}...</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{name}</td>
      <td>
        <EtherscanLink
          chainId={chainId}
          hash={contractAddress}
          text={truncateMiddle(contractAddress)}
        />
      </td>
      <td>{values.totalRewardsAvailable}</td>
      <td>{values.stakedBalance}</td>
      <td>{values.unstakedBalance}</td>
      <td>{values.rewardsBalance}</td>
    </tr>
  );
};
