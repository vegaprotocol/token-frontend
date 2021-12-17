import "./liquidity-container.scss";
import { Trans, useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { Links, REWARDS_ADDRESSES } from "../../config";
import { DexTokensSection } from "./dex-table";
import { LiquidityState } from "./liquidity-reducer";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { Error } from "../../components/icons";
import { Callout } from "../../components/callout";

export const LiquidityContainer = ({ state }: { state: LiquidityState }) => {
  const { t } = useTranslation();
  const { ethAddress } = useWeb3();
  return (
    <section className="liquidity-container">
      <h2>{t("liquidityRewardsTitle")}</h2>
      <p>
        {t("liquidityOnsenIntro")}
        <a href={Links.SUSHI_ONSEN_WHAT_IS}>{t("liquidityOnsenHowItWorks")}</a>
        {", "}
        <a href={Links.SUSHI_ONSEN_FAQ}>{t("liquidityOnsenFAQ")}</a>
      </p>
      <p>
        <a href={Links.SUSHI_ONSEN_MENU}>
          <button className="fill button-secondary">
            {t("liquidityOnsenLinkText")}
          </button>
        </a>
      </p>

      <h2>{t("liquidityRewardsTitlePrevious")}</h2>
      <Callout intent="error" title={t("lpEndedTitle")}>
        <p>{t("lpEndedParagraph")}</p>
      </Callout>
      {!ethAddress && <EthConnectPrompt />}
      {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
        return (
          <DexTokensSection
            key={name}
            name={name}
            contractAddress={contractAddress}
            ethAddress={ethAddress}
            state={state}
          />
        );
      })}
    </section>
  );
};
