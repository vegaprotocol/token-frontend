import { useTranslation } from "react-i18next";

import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { Heading } from "../../components/heading";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useTranches } from "../../hooks/use-tranches";
import { RouteChildProps } from "..";
import Claim from "./claim";
import { ClaimRestricted } from "./claim-restricted";
import { isRestricted } from "./lib/is-restricted";

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
    <>
      <Heading title={t("pageTitleClaim")} />
      {content}
    </>
  );
};

export default ClaimIndex;
