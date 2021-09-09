import React from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";
import { REWARDS_ADDRESSES } from "../../config";
import { useVegaLPStaking } from "../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../lib/bignumber";

interface DexTokensUnstakedProps {
  ethAddress: string;
}

/**
 * Maps over a list of dex contracts and shows the connected
 * wallet's balance in the relevant tokens
 */
export const DexTokensUnstaked = ({ ethAddress }: DexTokensUnstakedProps) => {
  const { t } = useTranslation();
  const title = t("liquidityTokensWalletTitle");

  return (
    <section className="dex-rewards-list">
      <h2>{title}</h2>
      <p>{t("liquidityTokensWalletIntro")}</p>
      <table className={"key-value-table dex-rewards-list-table"}>
        <thead>
          <tr>
            <th>{t("liquidityTokenTitle")}</th>
            <th>{t("liquidityTokenBalance")}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
            return (
              <DexTokensUnstakedItem
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

interface DexTokensUnstakedItemProps {
  name: string;
  contractAddress: string;
  ethAddress: string;
}

export const DexTokensUnstakedItem = ({
  name,
  contractAddress,
  ethAddress,
}: DexTokensUnstakedItemProps) => {
  const lpStaking = useVegaLPStaking({ address: contractAddress });
  const [unstakedBalance, setUnstakedBalance] = React.useState("0");
  const [approvedAmount, setApprovedAmount] = React.useState<BigNumber>(
    new BigNumber("0")
  );

  React.useEffect(() => {
    const run = async () => {
      try {
        const [balance, allowance] = await Promise.all([
          lpStaking.totalUnstaked(ethAddress),
          lpStaking.allowance(ethAddress),
        ]);
        setUnstakedBalance(balance);
        setApprovedAmount(new BigNumber(allowance));
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);
  const hasApproved = React.useMemo(
    () => !approvedAmount.isEqualTo(0),
    [approvedAmount]
  );
  return (
    <tr id={contractAddress}>
      <td>{name}</td>
      <td>
        {unstakedBalance}&nbsp;
        {hasApproved ? null : <button className="button-link">Approve</button>}
        &nbsp;
        <button disabled={!hasApproved} className="button-link">
          Deposit
        </button>
        &nbsp;
      </td>
    </tr>
  );
};
