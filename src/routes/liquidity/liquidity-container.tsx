import React from "react";
import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { REWARDS_ADDRESSES } from "../../config";
import { useEthUser } from "../../hooks/use-eth-user";
import { DexTokensSection } from "./dex-table";
import { LiquidityAction, LiquidityState } from "./liquidity-reducer";

const BLOG_LINK =
  "https://blog.vega.xyz/unlocking-vega-coinlist-pro-uniswap-sushiswap-b1414750e358";

export const LiquidityContainer = ({
  state,
  dispatch,
}: {
  state: LiquidityState;
  dispatch: React.Dispatch<LiquidityAction>;
}) => {
  const { t } = useTranslation();
  const { ethAddress } = useEthUser();
  return (
    <>
      <p>{t("liquidityIntro")}</p>
      <p>
        {t("liquidityIntroInstructionsLink")}.&nbsp;
        <a href={BLOG_LINK} target="_blank" rel="nofollow noreferrer">
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
            state={state}
            dispatch={dispatch}
          />
        );
      })}
    </>
  );
};
