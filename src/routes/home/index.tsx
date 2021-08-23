import "./home.scss";

import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { TokenDetails } from "../../components/token-details";

const Home = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
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

      <h2>{t("Staking")}</h2>
      <p>
        {t(
          "Token holders can nominate their tokens to a validator and are rewarded a proportion of the fees accumulated for infrastructure"
        )}
      </p>
    </TemplateDefault>
  );
};

export default Home;
