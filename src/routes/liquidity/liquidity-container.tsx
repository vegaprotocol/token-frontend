import "./liquidity-container.scss";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { Links, REWARDS_ADDRESSES } from "../../config";
import { DexTokensSection } from "./dex-table";
import { LiquidityAction, LiquidityState } from "./liquidity-reducer";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

export const LiquidityContainer = ({
  state,
  dispatch,
}: {
  state: LiquidityState;
  dispatch: React.Dispatch<LiquidityAction>;
}) => {
  const { t } = useTranslation();
  const { ethAddress } = useWeb3();
  return (
    <section className="liquidity-container">
      <Trans
        i18nKey="liquidityIntro"
        components={{
          bold: <strong />,
          linkToPost: (
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            <a
              href={Links.INCENTIVE_PROGRAM_BLOG_POST}
              target="_blank"
              rel="nofollow noreferrer"
            />
          ),
        }}
      />
      <h2>{t("liquidityTitle")}</h2>
      <ol>
        <li>
          {t("liquidityStep1Title")}
          <p>{t("liquidityStep1Body")}</p>
        </li>
        <li>
          {t("liquidityStep2Title")}
          <p>{t("liquidityStep2Body")}</p>
        </li>
        <li>
          {t("liquidityStep3Title")}
          <p>{t("liquidityStep3Body")}</p>
        </li>
        <li>
          {t("liquidityStep4Title")}
          <p>{t("liquidityStep4Body")}</p>
        </li>
      </ol>

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
    </section>
  );
};
