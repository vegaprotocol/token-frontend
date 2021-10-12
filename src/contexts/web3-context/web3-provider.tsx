import React from "react";
// @ts-ignore
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { useTranslation } from "react-i18next";
import { EthereumChainId, EthereumChainNames, INFURA_URL } from "../../config";
import { Web3Context } from "./web3-context";
import Web3 from "web3";

/**
 * Provides a raw web3 provider (usually window.ethereum injected by a chrome extension), a Web3
 * instance and the current chainId to its children. Also sets up an listener for the
 * changeChanged event and handles rendering logic to only render children if the configured
 * chainId matches what is set in the users logic.
 */
export const Web3Provider = ({ children }: { children: JSX.Element }) => {
  const { t } = useTranslation();
  const provider = React.useRef<any>(
    new Web3.providers.HttpProvider(INFURA_URL)
  );
  const web3 = React.useRef<Web3>(new Web3(provider.current));
  const [chainId, setChainId] = React.useState<EthereumChainId | null>(null);

  // Get and set the chainId if the provider is ready
  React.useEffect(() => {
    const getChainId = async () => {
      const chainId = await web3.current.eth.getChainId();
      console.log(chainId);
      setChainId(`0x${chainId}` as EthereumChainId);
    };

    getChainId();
  }, []);

  // Bind a listener for chainChanged if the provider is ready
  // React.useEffect(() => {
  //   const bindChainChangeListener = () => {
  //     provider.current.on("chainChanged", (newChainId: EthereumChainId) => {
  //       Sentry.addBreadcrumb({
  //         type: "ChainChanged",
  //         level: Severity.Log,
  //         message: "User changed chain in wallet provider",
  //         data: {
  //           old: chainId,
  //           new: newChainId,
  //         },
  //         timestamp: Date.now(),
  //       });
  //       setChainId(newChainId);
  //     });
  //   };

  //   if (status === ProviderStatus.Ready) {
  //     bindChainChangeListener();
  //   }

  //   return () => {
  //     if (
  //       provider.current &&
  //       typeof provider.current.removeAllListeners === "function"
  //     ) {
  //       provider.current.removeAllListeners("chainChanged");
  //     }
  //   };
  // }, [chainId, status]);

  // App cant work without a web3 provider so return with a splash
  // screen preventing further actions
  // if (status === ProviderStatus.None || status === ProviderStatus.Invalid) {
  //   return (
  //     <SplashScreen>
  //       <div>
  //         {status === ProviderStatus.Invalid
  //           ? t("invalidWeb3Provider")
  //           : t("invalidWeb3Browser")}
  //       </div>
  //     </SplashScreen>
  //   );
  // }

  // Still waiting for the provider to be detected and the chainId fetched
  if (chainId === null || provider.current === null || web3.current === null) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  // Chain ID retrieved from provider isn't the same as what the app is
  // configured to work with. Prevent further actions with splash screen
  if (chainId !== process.env.REACT_APP_CHAIN) {
    const currentChain = EthereumChainNames[chainId];
    const desiredChain =
      EthereumChainNames[process.env.REACT_APP_CHAIN as EthereumChainId];
    return (
      <SplashScreen>
        <div>
          <p>
            {/* If we can find a friendly name for chain use it else fall back to generic message */}
            {currentChain
              ? t("wrongNetwork", { chain: currentChain })
              : t("wrongNetworkUnknownChain", { chain: desiredChain })}
            {t("Desired network", {
              chain: desiredChain,
            })}
          </p>
        </div>
      </SplashScreen>
    );
  }

  return (
    <Web3Context.Provider
      value={{
        provider: provider.current,
        web3: web3.current,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
