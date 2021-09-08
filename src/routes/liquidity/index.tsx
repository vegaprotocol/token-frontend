import React from "react";
import {useTranslation} from "react-i18next";
import {RouteChildProps} from "..";
import {Web3Provider} from "../../components/web3-provider";
import {useDocumentTitle} from "../../hooks/use-document-title";
import {DexTokensStaked} from "./dex-tokens-staked";
import {DexRewardsList} from "./dex-rewards-list";
import {DexTokensUnstaked} from "./dex-tokens-unstaked";
import {TemplateDefault} from "../../components/page-templates/template-default";
import {ADDRESSES } from "../../config";
import {DexContractState} from "./dex-liquidity-reducer";
import {useVegaLPStaking} from "../../hooks/use-vega-lp-staking";

// It's possible for us to deploy with just addresses. Bad but possible. These 'flags'
// are here in case we have to do that.
const DISABLE_EARNING = true;
const DISABLE_CONNECTED = true;

const BLOG_LINK = "https://blog.vega.xyz/unlocking-vega-coinlist-pro-uniswap-sushiswap-b1414750e358";

const RedemptionIndex = ({name}: RouteChildProps) => {
  useDocumentTitle(name);
  const {t} = useTranslation();

  const contracts = {
     "sushi-vega-eth": useVegaLPStaking(ADDRESSES.dexLiquidityRewards["sushi-vega-eth"])
  }

  const AvailableRewards = ADDRESSES.dexLiquidityRewards;
  return (
    <TemplateDefault title={t("pageTitleLiquidity")}>
      <p>{t('liquidityIntro')}</p>
      <p>
        {t('liquidityIntroInstructionsLink')}.&nbsp;
        <a href={BLOG_LINK} rel="nofollow noreferrer">{t('liquidityIntroInstructionsLink')}</a>.
      </p>
      <Web3Provider>
        {(address) => (
          <>
            <DexRewardsList contracts={contracts} />
            { DISABLE_EARNING ? null : <DexTokensStaked contracts={REWARD_CONTRACTS}/> }
            { DISABLE_CONNECTED ? null : <DexTokensUnstaked contracts={REWARD_CONTRACTS}/> }
          </>
        )}
      </Web3Provider>
    </TemplateDefault>
  );
};

export default RedemptionIndex;
