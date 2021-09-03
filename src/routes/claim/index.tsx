import { useTranslation } from "react-i18next";
import Claim from "./claim";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { isRestricted } from "./lib/is-restricted";
import { ClaimRestricted } from "./claim-restricted";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useEthUser } from "../../hooks/use-eth-user";
import { useTranches } from "../../hooks/use-tranches";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";

const ClaimIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
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

  if (!address) {
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
