import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { TrancheContainer } from "../../components/tranche-container";
import { VegaWallet } from "../../components/vega-wallet";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import RedemptionRouter from "./redemption";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <TemplateSidebar
      title={t("pageTitleRedemption")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Web3Container>
        {(address) => (
          <TrancheContainer address={address}>
            {(tranches) => (
              <VegaWalletContainer>
                {({ vegaKey }) => (
                  <RedemptionRouter address={address} tranches={tranches} />
                )}
              </VegaWalletContainer>
            )}
          </TrancheContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default RedemptionIndex;
