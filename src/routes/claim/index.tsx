import { useTranslation } from "react-i18next";
import Claim from "./claim";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { isRestricted } from "./lib/is-restricted";
import { ClaimRestricted } from "./claim-restricted";
import { useTranches } from "../../hooks/use-tranches";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";

const ClaimIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const { ethAddress } = useWeb3();
  const tranches = useTranches();

  if (!tranches.length) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  let content = null;

  if (!ethAddress) {
    content = (
      <EthConnectPrompt>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
      </EthConnectPrompt>
    );
  } else {
    content = isRestricted() ? (
      <ClaimRestricted />
    ) : (
      <Claim address={ethAddress} tranches={tranches} />
    );
  }

  return (
    <TemplateSidebar
      title={t("pageTitleClaim")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      {content}
    </TemplateSidebar>
  );
};

export default ClaimIndex;
