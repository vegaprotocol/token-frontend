import {useTranslation} from "react-i18next";
import {RouteChildProps} from "..";
import {Web3Provider} from "../../components/web3-provider";
import {useDocumentTitle} from "../../hooks/use-document-title";
import {DexTokensStaked} from "./dex-tokens-staked";
import {DexRewardsList} from "./dex-rewards-list";
import {BigNumber} from "../../lib/bignumber";
import {DexTokensUnstaked} from "./dex-tokens-unstaked";
import {TemplateDefault} from "../../components/page-templates/template-default";
import {ADDRESSES } from "../../config";

// It's possible for us to deploy with just addresses. Bad but possible. These 'flags'
// are here in case we have to do that.
const DISABLE_EARNING = true;
const DISABLE_CONNECTED = true;

const BLOG_LINK = "https://blog.vega.xyz/unlocking-vega-coinlist-pro-uniswap-sushiswap-b1414750e358";

/**
 * What I imagine we need to know about a contract to render this
 */
export type DexLPStakingContract = {
  // The ethereum address of the contract
  address: string,
  // A title we can use to refer to the contract (a pair maybe?)
  title: string,
  // The total reward that has been deposited for distribution
  availableRewardBalance: BigNumber,
  // The token that this contract deals with
  acceptsToken: string,
  // The earned reward balance that the connected wallet has earned
  connectedUserRewardBalance: BigNumber
  // The balance of acceptsToken that the user has in this contract
  connectedUserBalance: BigNumber,
  estimatedAPY: number
}

const REWARD_CONTRACTS: DexLPStakingContract[] = [
  {
    address: "0x0",
    title: "VEGA/ONE",
    connectedUserBalance: new BigNumber("1"),
    availableRewardBalance: new BigNumber("1"),
    connectedUserRewardBalance: new BigNumber("1"),
    acceptsToken: "0x1",
    estimatedAPY: 0
  },
  {
    address: "0x1",
    title: "VEGA/TWO",
    connectedUserBalance: new BigNumber("1"),
    availableRewardBalance: new BigNumber("1"),
    connectedUserRewardBalance: new BigNumber("1"),
    acceptsToken: "0x0",
    estimatedAPY: 0
  }
]

const RedemptionIndex = ({name}: RouteChildProps) => {
  useDocumentTitle(name);
  const {t} = useTranslation();

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
            <DexRewardsList contracts={AvailableRewards} />
            { DISABLE_EARNING ? null : <DexTokensStaked contracts={REWARD_CONTRACTS}/> }
            { DISABLE_CONNECTED ? null : <DexTokensUnstaked contracts={REWARD_CONTRACTS}/> }
          </>
        )}
      </Web3Provider>
    </TemplateDefault>
  );
};

export default RedemptionIndex;
