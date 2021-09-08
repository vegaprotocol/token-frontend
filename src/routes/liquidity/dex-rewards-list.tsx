import "./dex-rewards-list.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { EtherscanLink } from "../../components/etherscan-link";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { REWARDS_ADDRESSES } from "../../config";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";

/**
 * Maps over a list of contracts and fetches the total
 * reward deposited in that contract
 */
export const DexRewardsList = () => {
  const { t } = useTranslation();

  return (
    <section className="dex-rewards-list">
      <h2>{t("liquidityTotalAvailableRewards")}</h2>
      <table className="dex-rewards-list-table key-value-table">
        <thead className="key-value-table__header">
          <tr>
            <th>{t("liquidityTotalAvailableRewardsToken")}</th>
            <th>{t("liquidityTotalAvailableAddress")}</th>
            <th>{t("liquidityTotalAvailableRewardsBalance")}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
            return (
              <DexRewardsListItem
                key={name}
                name={name}
                contractAddress={contractAddress}
              />
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

interface DexRewardsListItemProps {
  name: string;
  contractAddress: string;
}

export const DexRewardsListItem = ({
  name,
  contractAddress,
}: DexRewardsListItemProps) => {
  const {
    appState: { chainId },
  } = useAppState();
  const lpStaking = useVegaLPStaking({ address: contractAddress });
  const [total, setTotal] = React.useState("0");

  React.useEffect(() => {
    const run = async () => {
      try {
        const supply = await lpStaking.awardTokenTotalSupply();
        setTotal(supply);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [lpStaking]);

  return (
    <tr>
      <td>{name}</td>
      <td>
        <EtherscanLink
          chainId={chainId}
          hash={contractAddress}
          text={contractAddress}
        />
      </td>
      <td>{total}</td>
    </tr>
  );
};
