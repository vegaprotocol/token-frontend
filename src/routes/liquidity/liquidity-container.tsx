// It's possible for us to deploy with just addresses. Bad but possible. These 'flags'

import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { useEthUser } from "../../hooks/use-eth-user";
import { DexRewardsList } from "./dex-rewards-list";
import { DexTokensStaked } from "./dex-tokens-staked";
import { DexTokensUnstaked } from "./dex-tokens-unstaked";

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
      <DexRewardsList />
      {DISABLE_EARNING ? null : <DexTokensStaked ethAddress={ethAddress} />}
      {DISABLE_CONNECTED ? null : <DexTokensUnstaked ethAddress={ethAddress} />}
    </>
  );
};
