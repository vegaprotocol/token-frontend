import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { AssociatePage } from "./associate-page";

const Associate = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);

  return (
    <TemplateSidebar
      title={t("pageTitleAssociate")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Web3Container>
        {(address) => (
          <VegaWalletContainer>
            {/* TODO move this into it's own component this is getting pretty bulky */}
            {({ vegaKey }) => (
              <AssociatePage address={address} vegaKey={vegaKey} />
            )}
          </VegaWalletContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default Associate;
