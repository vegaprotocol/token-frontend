import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { VegaWalletContainer } from "../../components/vega-wallet-container";

const Disassociate = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);

  return (
    <TemplateSidebar
      title={t("pageTitleDisassociate")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Web3Container>
        {(address) => (
          <VegaWalletContainer>
            {({ vegaKey }) => (
              <div>
                Disassociate {vegaKey.pub}/{address}
              </div>
            )}
          </VegaWalletContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default Disassociate;
