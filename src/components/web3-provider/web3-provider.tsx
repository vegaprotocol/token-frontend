import React from "react";
// @ts-ignore
import detectEthereumProvider from "DETECT_PROVIDER_PATH/detect-provider";
import { SplashScreen } from "../splash-screen";
import { SplashLoader } from "../splash-loader";
import { useTranslation } from "react-i18next";

enum ProviderStatus {
  Pending,
  Ready,
  None,
  Invalid,
}

export const Web3Provider = ({
  children,
}: {
  children: (provider: object) => JSX.Element;
}) => {
  const { t } = useTranslation();
  const provider = React.useRef<any>();
  const [status, setStatus] = React.useState(ProviderStatus.Pending);

  // Detect provider
  React.useEffect(() => {
    detectEthereumProvider()
      .then((res: any) => {
        // Extra check helps with Opera's legacy web3 - it properly falls through to NOT_DETECTED
        if (res && res.request) {
          provider.current = res;
          setStatus(ProviderStatus.Ready);
        } else {
          setStatus(ProviderStatus.Invalid);
        }
      })
      .catch(() => {
        setStatus(ProviderStatus.None);
      });
  }, []);

  if (status === ProviderStatus.Pending) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  if (status !== ProviderStatus.Ready) {
    return (
      <SplashScreen>
        <div>
          {status === ProviderStatus.Invalid
            ? t("invalidWeb3Provider")
            : t("invalidWeb3Browser")}
        </div>
      </SplashScreen>
    );
  }

  return children(provider.current);
};
