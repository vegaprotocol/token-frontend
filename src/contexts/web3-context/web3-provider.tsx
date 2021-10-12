import React from "react";
import * as Sentry from "@sentry/react";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { useTranslation } from "react-i18next";
import { EthereumChainId, EthereumChainNames, INFURA_URL } from "../../config";
import { Web3Context } from "./web3-context";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const web3Modal = new Web3Modal({
  cacheProvider: true,
  theme: "dark",
  providerOptions: {
    // Example with injected providers
    injected: {
      display: {
        name: "Injected",
        description: "Connect with the provider in your Browser",
      },
      package: null,
    },
    // Example with WalletConnect provider
    walletconnect: {
      display: {
        name: "Mobile",
        description: "Scan qrcode with your mobile wallet",
      },
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // required
      },
    },
  },
});

/**
 * Provides a raw web3 provider (usually window.ethereum injected by a chrome extension), a Web3
 * instance and the current chainId to its children. Also sets up an listener for the
 * changeChanged event and handles rendering logic to only render children if the configured
 * chainId matches what is set in the users logic.
 */
export const Web3Provider = ({ children }: { children: JSX.Element }) => {
  const { t } = useTranslation();

  // Default to http provider using infura, later we reset this using
  // the users connected wallet
  const provider = React.useRef<any>(
    new Web3.providers.HttpProvider(INFURA_URL)
  );
  const web3 = React.useRef<Web3>(new Web3(provider.current));
  const [chainId, setChainId] = React.useState<EthereumChainId | null>(null);
  const [ethAddress, setEthAddress] = React.useState("");

  const connect = React.useCallback(async () => {
    provider.current = await web3Modal.connect();
    web3.current = new Web3(provider.current);

    const accounts = await provider.current.request({
      method: "eth_requestAccounts",
    });

    setEthAddress(accounts[0]);
  }, []);

  // Get and set the chainId if the provider is ready
  React.useEffect(() => {
    const getChainId = async () => {
      const chainId = await web3.current.eth.getChainId();
      setChainId(`0x${chainId}` as EthereumChainId);
    };

    getChainId();
  }, []);

  // Bind a listener for chainChanged if the provider is ready
  React.useEffect(() => {
    const bindListeners = () => {
      provider.current.on("chainChanged", (newChainId: EthereumChainId) => {
        Sentry.addBreadcrumb({
          type: "ChainChanged",
          level: Sentry.Severity.Log,
          message: "User changed chain in wallet provider",
          data: {
            old: chainId,
            new: newChainId,
          },
          timestamp: Date.now(),
        });
        setChainId(newChainId);
      });

      provider.current.on("accountsChanged", (accounts: string[]) => {
        Sentry.addBreadcrumb({
          type: "AccountsChanged",
          level: Sentry.Severity.Log,
          message: "User changed accounts in wallet provider",
          data: {
            old: ethAddress, // state.ethAddress,
            new: accounts[0],
          },
          timestamp: Date.now(),
        });
        Sentry.setUser({ id: accounts[0] });
        setEthAddress(accounts[0]);
      });
    };

    if (ethAddress) {
      bindListeners();
    }

    return () => {
      if (
        provider.current &&
        typeof provider.current.removeAllListeners === "function"
      ) {
        provider.current.removeAllListeners();
      }
    };
  }, [chainId, ethAddress]);

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

  // Wait for fetching chain ID to ensure HttpProvider is running
  if (chainId === null) {
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
        connect,
        provider: provider.current,
        web3: web3.current,
        chainId,
        ethAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
