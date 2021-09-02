import { useTranslation } from "react-i18next";
import { useParams, useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
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
      sidebar={[<EthWallet />]}
    >
      <Web3Container>
        {(address) => (
          <TrancheContainer address={address}>
            {(tranches) => (
              <RedemptionRouter address={address} tranches={tranches} />
            )}
          </TrancheContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default RedemptionIndex;
