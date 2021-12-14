import "./eth-wallet-container.scss";

import React from "react";
import { useTranslation } from "react-i18next";

import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { Ethereum } from "../icons";

interface EthWalletContainerProps {
  children: (address: string) => React.ReactElement;
}

export const EthWalletContainer = ({ children }: EthWalletContainerProps) => {
  const { t } = useTranslation();
  const { connect, ethAddress } = useWeb3();

  if (!ethAddress) {
    return (
      <button
        className="eth-wallet-container fill"
        type="button"
        onClick={connect}
      >
        <div>{t("connectEthWallet")}</div>
        <Ethereum />
      </button>
    );
  }

  return children(ethAddress);
};
