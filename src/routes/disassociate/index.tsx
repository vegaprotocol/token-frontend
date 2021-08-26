import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { DisassociatePage } from "./disassociate-page";

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
              <DisassociatePage vegaKey={vegaKey} address={address} />
            )}
          </VegaWalletContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default Disassociate;
