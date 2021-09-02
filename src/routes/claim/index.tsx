import { useTranslation } from "react-i18next";
import Claim from "./claim";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { isRestricted } from "./lib/is-restricted";
import { ClaimRestricted } from "./claim-restricted";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useTranches } from "../../hooks/use-tranches";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { EthWrongChainPrompt } from "../../components/eth-connect-prompt/eth-wrong-chain-prompt";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";

const ClaimIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { address } = useEthUser();
  const tranches = useTranches();

  if (!tranches.length) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  let content = null;

  if (appState.appChainId !== appState.chainId) {
    content = <EthWrongChainPrompt />;
  } else if (!address) {
    content = <EthConnectPrompt />;
  } else {
    content = isRestricted() ? (
      <ClaimRestricted />
    ) : (
      <Claim address={address} tranches={tranches} />
    );
  }

  return (
    <TemplateDefault title={t("pageTitleClaim")}>{content}</TemplateDefault>
  );
};

export default ClaimIndex;
