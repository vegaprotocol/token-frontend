import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { VegaWallet } from "../../components/vega-wallet";
import { Flags } from "../../config";
import { useDocumentTitle } from "../../hooks/use-document-title";
import RedemptionRouter from "./redemption";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const tranche = useRouteMatch(`${match.path}/:id`);

  return (
    <TemplateSidebar
      title={
        tranche ? t("pageTitleRedemptionTranche") : t("pageTitleRedemption")
      }
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      {Flags.REDEEM_DISABLED ? (
        <p>{t("redeemComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</p>
      ) : (
        <RedemptionRouter />
      )}
    </TemplateSidebar>
  );
};

export default RedemptionIndex;
