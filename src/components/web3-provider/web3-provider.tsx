import React from "react";
// @ts-ignore
import detectEthereumProvider from "DETECT_PROVIDER_PATH/detect-provider";
import { SplashScreen } from "../splash-screen";
import { SplashLoader } from "../splash-loader";
import { useTranslation } from "react-i18next";
import { EthereumChainId, EthereumChainNames } from "../../lib/web3-utils";
import * as Sentry from "@sentry/react";
import { Severity } from "@sentry/react";

enum ProviderStatus {
  Pending,
  Ready,
  None,
  Invalid,
}

export const Web3Provider = ({
  children,
}: {
  children: (data: { provider: any; chainId: EthereumChainId }) => JSX.Element;
}) => {
  const { t } = useTranslation();
  const provider = React.useRef<any>();
  const [status, setStatus] = React.useState(ProviderStatus.Pending);
  const [chainId, setChainId] = React.useState<EthereumChainId | null>(null);

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

  React.useEffect(() => {
    const getChainId = async () => {
      const chainId = await provider.current.request({
        method: "eth_chainId",
      });
      setChainId(chainId);
    };

    if (status === ProviderStatus.Ready) {
      getChainId();
    }
  }, [status]);

  React.useEffect(() => {
    const bindChainChangeListener = () => {
      provider.current.on("chainChanged", (newChainId: EthereumChainId) => {
        Sentry.addBreadcrumb({
          type: "AccountsChanged",
          level: Severity.Log,
          message: "User changed chain in wallet provider",
          data: {
            old: chainId,
            new: newChainId,
          },
          timestamp: Date.now(),
        });
        setChainId(newChainId);
      });
    };

    if (status === ProviderStatus.Ready) {
      bindChainChangeListener();
    }
    return () => {
      provider.current.removeAllListeners("chainChanged");
    };
  }, [chainId, status]);

  if (status === ProviderStatus.None || status === ProviderStatus.Invalid) {
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

  if (status === ProviderStatus.Pending || chainId === null) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  if (chainId !== process.env.REACT_APP_CHAIN) {
    const currentChain = EthereumChainNames[chainId];
    const desiredChain =
      EthereumChainNames[process.env.REACT_APP_CHAIN as EthereumChainId];
    return (
      <SplashScreen>
        <div>
          <p>
            {t("Wrong network", { chain: currentChain })}.{" "}
            {t("Desired network", {
              chain: desiredChain,
            })}
          </p>
        </div>
      </SplashScreen>
    );
  }

  return children({ provider: provider.current, chainId });
};
