import {
  Networks,
  VegaClaim,
  VegaErc20Bridge,
  VegaStaking,
  VegaToken,
  VegaVesting,
} from "@vegaprotocol/smart-contracts-sdk";
import { ethers } from "@vegaprotocol/smart-contracts-sdk/node_modules/ethers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import React from "react";

import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { ADDRESSES } from "../../config";
import { ContractsContext, ContractsContextShape } from "./contracts-context";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { library, connector, account } = useWeb3React();
  const [pending, setPending] = React.useState(false);
  const [contracts, setContracts] =
    React.useState<ContractsContextShape | null>(null);

  React.useEffect(() => {
    if (!contracts || !account) return;

    // Bind listeners for events on staking contract

    // contracts.staking.bindEventListeners(
    //   ["Stake_Deposited", "Stake_Removed"],
    //   [account]
    // );

    // Watch for updates to transactions

    contracts.staking.watchTransactions(
      (
        txs: Array<{
          tx: ethers.providers.TransactionResponse;
          receipt: ethers.providers.TransactionReceipt;
          pending: boolean;
        }>
      ) => {
        console.log(txs);
        setPending(txs.some((tx) => tx.pending));
      }
    );
  }, [contracts, account]);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (library && !cancelled) {
        let signer = null;
        if (connector instanceof InjectedConnector) {
          const authorized = await connector.isAuthorized();
          signer = authorized ? library.getSigner() : null;
        }

        const token = new VegaToken(
          library,
          signer,
          ADDRESSES.vegaTokenAddress
        );
        const decimals = await token.decimals();
        setContracts({
          token,
          staking: new VegaStaking(library, Networks.DEVNET),
          vesting: new VegaVesting(
            library,
            signer,
            ADDRESSES.vestingAddress,
            decimals
          ),
          claim: new VegaClaim(
            library,
            signer,
            ADDRESSES.claimAddress,
            decimals
          ),
          erc20Bridge: new VegaErc20Bridge(
            library,
            signer,
            ADDRESSES.erc20Bridge
          ),
        });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [library, connector]);

  if (!contracts) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <ContractsContext.Provider value={contracts}>
      {pending ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            background: "red",
            color: "blac",
            padding: 10,
            zIndex: 9999,
          }}
        >
          PENDING
        </div>
      ) : null}
      {children}
    </ContractsContext.Provider>
  );
};
