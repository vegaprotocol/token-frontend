import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { EthWallet } from "../../components/eth-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import {DexTokenRewards} from "./dex-token-rewards";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <TemplateSidebar title={t("pageTitleLiquidity")} sidebar={[<EthWallet />]}>
      <Web3Container>
        {(address) => (
          <DexTokenRewards address={address} />
       )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default RedemptionIndex;
