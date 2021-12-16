import React from "react";
import * as Sentry from "@sentry/react";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { useTranslation } from "react-i18next";
import {
  APP_CHAIN_ID,
  ChainIdMap,
  EthereumChainId,
  EthereumChainNames,
} from "../../config";
import { Web3Context } from "./web3-context";
import { ethers } from "ethers";
import Web3Modal, { getInjectedProviderName } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BigNumber } from "../../lib/bignumber";

const web3Modal = new Web3Modal({
  cacheProvider: true,
  theme: "dark",
  // Opera doesn't seem to work, so if you're on Opera you have to use
  // WalletConnect to connect
  disableInjectedProvider: getInjectedProviderName() === "Opera",
  providerOptions: {
    // Injected providers. E.G. browser extensions such as Metamask
    injected: {
      display: {
        name: "Injected",
        description: "Connect with the provider in your browser",
      },
      package: null,
    },
    // Bridge to mobile wallets
    walletconnect: {
      display: {
        name: "Mobile",
        description: "Scan QR code with your mobile wallet",
      },
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // required
      },
    },
  },
});

/**
 * Provider contating logic for connecting to the Ethereum network via different Web3 providers
 * which in turn are supplied by the providerOptions object passed to Web3Modal above. Passes
 * down connect and disconnect methods, current address, chainId and the provider itself
 * to the context's consumers
 */
export const Web3Provider = ({ children }: { children: JSX.Element }) => {
  const { t } = useTranslation();
  const isStartup = React.useRef(true);

  // Default to HttpProvider with Infura, later we reset this using
  // the users connected wallet
  const [provider, setProvider] =
    React.useState<ethers.providers.BaseProvider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = React.useState<EthereumChainId | null>(null);
  const [ethAddress, setEthAddress] = React.useState("");
  const [gas, setGasPrice] = React.useState<BigNumber | null>(null);

  React.useEffect(() => {
    const run = async () => {
      if (provider) {
        try {
          const res = await provider.getGasPrice();
          const gwiePrice = new BigNumber(
            ethers.utils.formatUnits(res, "gwei")
          );
          setGasPrice(gwiePrice);
        } catch (e) {
          Sentry.captureException(e);
        }
      }
    };
    const interval = setInterval(run, 10000);
    return () => clearInterval(interval);
  }, [setGasPrice, provider]);

  // On connect replace the default provider and web3 instances (which uses an HttpProvider
  // with Infura) with an instance provided by the Web3Modal package
  const connect = React.useCallback(async () => {
    try {
      const rawProvider = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(rawProvider, "any");
      const signer = newProvider.getSigner();
      setProvider(newProvider);
      setSigner(signer);
      const network = await newProvider.getNetwork();
      const accounts = await newProvider.listAccounts();
      setChainId(`0x${network.chainId}` as EthereumChainId);
      setEthAddress(accounts[0]);
    } catch (err) {
      if (err === "Modal closed by user") {
        // noop
      } else {
        Sentry.captureException(err);
      }
    }
  }, []);

  // On disconnect we clear the connected address but also reset the provider and
  // web3 instances to using the default Http provider using Infura
  const disconnect = React.useCallback(async () => {
    try {
      setChainId(null);
      await web3Modal.clearCachedProvider();
      const newProvider = new ethers.providers.InfuraProvider(
        ChainIdMap[APP_CHAIN_ID],
        process.env.REACT_APP_INFURA_ID
      );
      setProvider(newProvider);
      setSigner(null);
      const network = await newProvider.getNetwork();
      setChainId(`0x${network.chainId}` as EthereumChainId);
      setEthAddress("");
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  // If its initial startup either: connect with users wallet which will in turn
  // get a chainId, or get the chainId from the default provider
  React.useEffect(() => {
    const run = async () => {
      if (web3Modal.cachedProvider) {
        connect();
      } else {
        const infuraProvider = new ethers.providers.InfuraProvider(
          ChainIdMap[APP_CHAIN_ID],
          process.env.REACT_APP_INFURA_ID
        );
        const network = await infuraProvider.getNetwork();
        setChainId(`0x${network.chainId}` as EthereumChainId);
        setProvider(infuraProvider);
      }
    };

    if (isStartup.current) {
      run();
      isStartup.current = false;
    }
  }, [connect]);

  // Bind events on the raw provider. Ethers doesnt provide these
  // https://github.com/ethers-io/ethers.js/issues/1396#issuecomment-806380431
  React.useEffect(() => {
    // only bind accountsChanged and chainChaned listenrs if we've
    // connected
    if (
      ethAddress &&
      provider instanceof ethers.providers.Web3Provider &&
      provider.provider &&
      // @ts-ignore
      typeof provider.provider.on === "function"
    ) {
      // @ts-ignore
      provider.provider.on("chainChanged", (newChainId: EthereumChainId) => {
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

      // @ts-ignore
      provider.provider.on("accountsChanged", (accounts: string[]) => {
        Sentry.addBreadcrumb({
          type: "AccountsChanged",
          level: Sentry.Severity.Log,
          message: "User changed accounts in wallet provider",
          data: {
            old: ethAddress,
            new: accounts[0],
          },
          timestamp: Date.now(),
        });
        Sentry.setUser({ id: accounts[0] });
        setEthAddress(accounts[0]);
      });
    }

    return () => {
      if (
        provider instanceof ethers.providers.Web3Provider &&
        provider.provider &&
        // @ts-ignore
        typeof provider.provider.removeAllListeners === "function"
      ) {
        // @ts-ignore
        provider.provider.removeAllListeners();
      }
    };
  }, [chainId, ethAddress, provider]);

  // Wait for fetching chain ID to ensure HttpProvider is running
  if (!provider || chainId === null) {
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
          <button onClick={disconnect} type="button">
            {t("disconnect")}
          </button>
        </div>
      </SplashScreen>
    );
  }

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        provider,
        signer,
        chainId,
        ethAddress,
        gas,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
