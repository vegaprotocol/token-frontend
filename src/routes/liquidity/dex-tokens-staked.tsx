import React from "react";
import { useTranslation } from "react-i18next";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";
import { REWARDS_ADDRESSES } from "../../config";

const isWithdrawEnabled = false;

interface DexTokensStakedProps {
  ethAddress: string;
}

/**
 * Maps over a list of contracts and displays how much a user
 * has staked in each
 */
export const DexTokensStaked = ({ ethAddress }: DexTokensStakedProps) => {
  const { t } = useTranslation();
  return (
    <section className="dex-rewards-list">
      <h2>{t("liquidityTokensContractTitle")}</h2>
      <p>{t("liquidityStakedIntro")}</p>
      <table className={"key-value-table dex-rewards-list-table"}>
        <thead>
          <tr>
            <th>{t("liquidityStakedToken")}</th>
            <th>{t("liquidityStakedBalance")}</th>
            <th>{t("liquidityStakedRewards")}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
            return (
              <DexTokensStakedItem
                key={name}
                name={name}
                contractAddress={contractAddress}
                ethAddress={ethAddress}
              />
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

interface DexTokensStakedItemProps {
  name: string;
  contractAddress: string;
  ethAddress: string;
}

export const DexTokensStakedItem = ({
  name,
  contractAddress,
  ethAddress,
}: DexTokensStakedItemProps) => {
  const { t } = useTranslation();
  const lpStaking = useVegaLPStaking({ address: contractAddress });
  const [userLPTokens, setUserLPTokens] = React.useState("0");
  const [userRewardBalance, setUserRewardBalance] = React.useState("0");

  React.useEffect(() => {
    const run = async () => {
      try {
        const LPTokens = await lpStaking.stakedBalance(ethAddress);
        const rewardBalance = await lpStaking.rewardsBalance(ethAddress);
        setUserLPTokens(LPTokens);
        setUserRewardBalance(rewardBalance);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);

  return (
    <tr>
      <td>{name}</td>
      <td>{userLPTokens}</td>
      <td>
        {userRewardBalance} VEGA
        {isWithdrawEnabled ? (
          <p>
            <button onClick={() => alert("TODO:")}>
              {t("liquidityStakedWithdraw")}
            </button>
          </p>
        ) : null}
      </td>
    </tr>
  );
};
