import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { ethers } from "ethers";
import React from "react";

import { injected } from "../lib/connectors";

export function useWeb3() {
  const context = useWeb3React();

  const fallback: Web3ReactContextInterface = React.useMemo(() => {
    return {
      ...context,
      library: new ethers.providers.InfuraProvider(
        3,
        process.env.REACT_APP_INFURA_ID
      ),
      chainId: 3,
    };
  }, [context]);

  // Use the browser/extension/connected wallet if active
  // otherwise use the fallback
  if (context.active) {
    return context;
  } else {
    return fallback;
  }
}

export function useEagerConnect() {
  const { activate, active } = useWeb3();
  const [tried, setTried] = React.useState(false);

  React.useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
    // eslint-disable-next-line
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  React.useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener() {
  const { active, error, activate } = useWeb3();

  React.useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
  }, [active, error, activate]);
}
