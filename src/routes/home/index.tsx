import "./home.scss";

import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TokenDetails } from "./token-details";
import { StakingOverview } from "./staking-overview";
import { Link } from "react-router-dom";
import React from "react";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { TemplateDefault } from "../../components/page-templates/template-default";

const Home = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);

  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();

  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: AppStateActionType.SET_TRANCHES, tranches });
    };

    run();
  }, [appDispatch, vesting]);

  if (appState.providerStatus === ProviderStatus.None) {
    return (
      <Callout title={t("Cannot connect")} intent="error" icon={<Error />}>
        <p>{t("invalidWeb3Browser")}</p>
      </Callout>
    );
  }

  return (
    <TemplateDefault title={t("pageTitleHome")}>
      <h2>{t("The Vega Token")}</h2>

      <TokenDetails />

      <h2>{t("Token Vesting")}</h2>
      <p>
        {t(
          "Most VEGA tokens are held in a vesting contract. This means that they cannot be transferred between wallets until their vesting term is complete"
        )}
      </p>
      <p>
        {t(
          "Tokens are held in different Tranches. Each tranche has its own schedule for how long the tokens are locked"
        )}
      </p>
      <p>
        {t(
          "Once tokens have unlocked they can be redeemed to the Ethereum wallet that owns them"
        )}
      </p>

      <h2>{t("Governance")}</h2>
      <p>{t("Token holders can propose changes to the Vega network")}</p>

      <p>
        <Link to={"/governance"}>{t("Read about Governance on Vega")}</Link>
      </p>

      <h2>{t("Staking")}</h2>
      <p>
        {t(
          "Token holders can nominate their tokens to a validator and are rewarded a proportion of the fees accumulated for infrastructure"
        )}
      </p>

      <StakingOverview totalStakedFormatted={appState.totalStakedFormatted} />

      <p>
        <Link to={"/staking"}>{t("Read about staking on Vega")}</Link>
      </p>
    </TemplateDefault>
  );
};

export default Home;
