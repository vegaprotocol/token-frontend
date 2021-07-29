import "./heading.scss";

import React from "react";
import vegaWhite from "../../images/vega_white.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConnect } from "../../hooks/use-connect";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaWeb3 } from "../../hooks/use-vega-web3";
import { EthereumChainIds } from "../../lib/vega-web3-utils";

export interface HeadingProps {
  title: React.ReactNode | string;
}

const ConnectedKey = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const connect = useConnect();
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
  const getBalances = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await vega.getUserBalanceAllTranches();
      setBalance(res);
    } finally {
      setLoading(false);
    }
  }, [vega]);
  const connectWithBalance = React.useCallback(async () => {
    await connect();
    await getBalances();
  }, [connect, getBalances]);
  const { appState } = useAppState();
  const { connecting, address, error } = appState;

  if (error) {
    return <div className="heading__error">{t("Something went wrong")}</div>;
  } else if (connecting) {
    return (
      <div className="heading__wallet">{t("Awaiting action in wallet...")}</div>
    );
  } else if (loading) {
    return <div className="heading__wallet">{t("Loading")}</div>;
  } else if (!address) {
    return (
      <button className="Button" onClick={connectWithBalance}>
        {t("Connect")}
      </button>
    );
  } else {
    return (
      <div className="heading__wallet">
        <span className="heading__wallet-label">{t("Account")}: </span>
        <span className="heading__wallet-value">
          <a
            rel="noreferrer"
            target="_blank"
            href={"https://etherscan.io/address/" + address}
          >
            {address.slice(0, 6) +
              "[...]" +
              address.slice(address.length - 4, address.length)}
          </a>
        </span>
        <span className="heading__wallet-label">{t("Vesting Balance")}: </span>
        <span className="heading__wallet-value">
          {balance} {t("VEGA")}
        </span>
      </div>
    );
  }
};

export const Heading = ({ title }: HeadingProps) => {
  return (
    <header className="heading">
      <div className="heading__nav">
        <div className="heading__logo-container">
          <Link to="/">
            <img alt="Vega" src={vegaWhite} className="heading__logo" />
          </Link>
        </div>
        <div className="heading__wallet-container">
          <ConnectedKey />
        </div>
      </div>
      <div className="heading__title-container">
        <div className="heading__title">{title}</div>
      </div>
    </header>
  );
};
