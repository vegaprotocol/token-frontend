import "./liquidity-container.scss";

import { Callout } from "@vegaprotocol/ui-toolkit";
import { useWeb3 } from "../../hooks/use-web3";
import { Trans, useTranslation } from "react-i18next";

import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { Error } from "../../components/icons";
import { Links, REWARDS_ADDRESSES } from "../../config";
import { DexTokensSection } from "./dex-table";
import { LiquidityState } from "./liquidity-reducer";

export const LiquidityContainer = ({ state }: { state: LiquidityState }) => {
  const { t } = useTranslation();
  const { account } = useWeb3();
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

      {!account && <EthConnectPrompt />}
      <h2>{t("liquidityRewardsTitle")}</h2>
      {Object.entries(REWARDS_ADDRESSES).map(([name, contractAddress]) => {
        return (
          <DexTokensSection
            key={name}
            name={name}
            contractAddress={contractAddress}
            ethAddress={account || ""}
            state={state}
          />
        );
      })}
    </section>
  );
};
