import "./eth-wallet-container.scss";

import React from "react";
import { useTranslation } from "react-i18next";

import { useWeb3 } from "../../hooks/use-web3";
import { injected } from "../../lib/connectors";
import { Ethereum } from "../icons";

interface EthWalletContainerProps {
  children: (address: string) => React.ReactElement;
}

export const EthWalletContainer = ({ children }: EthWalletContainerProps) => {
  const { t } = useTranslation();
  const { activate, account } = useWeb3();

  if (!account) {
    return (
      <button
        className="eth-wallet-container fill"
        type="button"
        onClick={() => activate(injected)}
      >
        <div>{t("connectEthWallet")}</div>
        <Ethereum />
      </button>
    );
  }

  return children(account);
};
