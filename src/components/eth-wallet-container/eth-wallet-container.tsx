import React from "react";
import { useTranslation } from "react-i18next";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

interface EthWalletContainerProps {
  children: (address: string) => React.ReactElement;
}

export const EthWalletContainer = ({ children }: EthWalletContainerProps) => {
  const { t } = useTranslation();
  const { connect, ethAddress } = useWeb3();

  if (!ethAddress) {
    return (
      <p>
        <button type="button" onClick={connect}>
          {t("Connect to an Ethereum wallet")}
        </button>
      </p>
    );
  }

  return children(ethAddress);
};
