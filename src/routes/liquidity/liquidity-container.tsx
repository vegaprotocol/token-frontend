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
      <Callout icon={<Error />} intent="error" title={t("lpEndedTitle")}>
        <p>{t("lpEndedParagraph")}</p>
        <p>
          <Trans
            i18nKey="lpDiscordPrompt"
            components={{
              discordLink: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a href={Links.DISCORD} target="_blank" rel="noreferrer" />
              ),
            }}
          />
        </p>
      </Callout>

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
          />
        );
      })}
    </section>
  );
};
