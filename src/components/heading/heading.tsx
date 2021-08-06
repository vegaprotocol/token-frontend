import "./heading.scss";

import React from "react";
import vegaWhite from "../../images/vega_white.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConnect } from "../../hooks/use-connect";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { EthereumChainId, EthereumChainIds } from "../../lib/web3-utils";
import { truncateAddress } from "../../lib/truncate-address";

export interface HeadingProps {
  title: React.ReactNode | string;
}

const ConnectedKey = () => {
  const { t } = useTranslation();
  const connect = useConnect();
  const { appState } = useAppState();
  const { connecting, address, error, balance } = appState;

  if (error) {
    return <div className="heading__error">{t("Something went wrong")}</div>;
  } else if (connecting) {
    return (
      <div className="heading__wallet">{t("Awaiting action in wallet...")}</div>
    );
  } else if (!address) {
    return <button onClick={connect}>{t("Connect")}</button>;
  } else {
    return (
      <div className="heading__wallet">
        <div>
          <span className="heading__wallet-label">{t("Account")}: </span>
          <span className="heading__wallet-value">
            <a
              rel="noreferrer"
              target="_blank"
              href={"https://etherscan.io/address/" + address}
            >
              {truncateAddress(address)}
            </a>
          </span>
        </div>
        <div>
          <span className="heading__wallet-label">
            {t("Vesting Balance")}:{" "}
          </span>
          <span className="heading__wallet-value">
            {balance?.toString()} {t("VEGA")}
          </span>
        </div>
      </div>
    );
  }
};

export const Heading = ({ title }: HeadingProps) => {
  const {
    appState: { appChainId },
    appDispatch,
  } = useAppState();
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
          {["1", "true"].includes(
            process.env.REACT_APP_SHOW_NETWORK_SWITCHER || ""
          ) && (
            <select
              value={appChainId}
              style={{ padding: 4 }}
              onChange={(e) => {
                appDispatch({
                  type: "APP_CHAIN_CHANGED",
                  newChainId: e.target.value as EthereumChainId,
                });
              }}
            >
              {Object.entries(EthereumChainIds).map(([name, val]) => (
                <option
                  key={val}
                  value={val}
                  disabled={
                    ![
                      EthereumChainIds.Ropsten,
                      EthereumChainIds.Mainnet,
                    ].includes(val)
                  }
                >
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="heading__title-container">
        <h1 className="heading__title">{title}</h1>
      </div>
    </header>
  );
};
