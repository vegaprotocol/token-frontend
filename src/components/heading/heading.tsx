import "./heading.scss";

import React from "react";
import vegaWhite from "../../images/vega_white.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConnect } from "../../hooks/use-connect";
import { useAppState } from "../../contexts/app-state/app-state-context";

export interface HeadingProps {
  error: string | null;
  connected: boolean;
  loading: boolean;
  pubkey: any;
  connect: () => void;
  balance: string;
  title: React.ReactNode | string;
}

const ConnectedKey = () => {
  const { t } = useTranslation();
  // const [balance, setBalance] = React.useState<string | null>(null);
  const [error, setError] = React.useState<boolean>(false);
  // const [loading, setLoading] = React.useState<boolean>(false);
  const connect = useConnect();
  const { appState } = useAppState();
  const { connecting, address } = appState;
  if (connecting) {
    return <div>Loading</div>;
  } else if (!address) {
    return (
      <button className="Button" onClick={connect}>
        {t("Connect")}
      </button>
    );
  } else if (error) {
    // TODO change this message
    return <div className="heading__error">{error}</div>;
  } else {
    return (
      <div className="heading__wallet">
        <span className="heading__wallet-label">Account: </span>
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
        {/* <span className="heading__wallet-label">Vesting Balance: </span> */}
        {/* <span className="heading__wallet-value">{balance} VEGA</span> */}
      </div>
    );
  }
};

export const Heading = ({
  error,
  connected,
  loading,
  // pubkey,
  // connect,
  title,
}: HeadingProps) => {
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
