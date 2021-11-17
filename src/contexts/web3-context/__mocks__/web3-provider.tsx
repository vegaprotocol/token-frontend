import React from "react";
import * as Sentry from "@sentry/react";
import { SplashScreen } from "../../../components/splash-screen";
import { SplashLoader } from "../../../components/splash-loader";
import { useTranslation } from "react-i18next";
import {
  APP_CHAIN_ID,
  ChainIdMap,
  EthereumChainId,
  EthereumChainNames,
} from "../../../config";
import { Web3Context } from "../web3-context";
import { ethers } from "ethers";

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
    React.useState<ethers.providers.BaseProvider>({} as ethers.providers.BaseProvider);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = React.useState<EthereumChainId>(APP_CHAIN_ID);
  const [ethAddress, setEthAddress] = React.useState("");

  // On connect replace the default provider and web3 instances (which uses an HttpProvider
  // with Infura) with an instance provided by the Web3Modal package
  const connect = React.useCallback(async () => {
    setProvider({} as ethers.providers.BaseProvider);
    setSigner(signer);
    setChainId(`0x1` as EthereumChainId);
    setEthAddress('123');
  }, []);

  // On disconnect we clear the connected address but also reset the provider and
  // web3 instances to using the default Http provider using Infura
  const disconnect = React.useCallback(async () => {
    setProvider({} as ethers.providers.BaseProvider);
    setSigner(null);
    setChainId(`0x1` as EthereumChainId);
    setEthAddress("");
  }, []);

  // If its initial startup either: connect with users wallet which will in turn
  // get a chainId, or get the chainId from the default provider
  React.useEffect(() => {
    setChainId(`0x1` as EthereumChainId);
    setProvider({} as ethers.providers.BaseProvider);
    if (isStartup.current) {
      isStartup.current = false;
    }
  }, [connect]);

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
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
