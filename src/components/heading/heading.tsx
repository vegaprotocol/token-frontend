import "./heading.scss";

import React from "react";
import vegaWhite from "../../images/vega_white.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface HeadingProps {
  error: string | null;
  connected: boolean;
  loading: boolean;
  pubkey: any;
  connect: () => void;
  balance: string;
}

export const Heading = ({
  error,
  connected,
  loading,
  // pubkey,
  connect,
}: // balance,
HeadingProps) => {
  const isHome = true; //useRouteMatch({ path: "/", exact: true });
  const { t } = useTranslation()

  return (
    <header className="heading">
      <div className="heading__nav">
        <div className="heading__logo-container">
          <Link to="/">
            <img alt="Vega" src={vegaWhite} className="heading__logo" />
          </Link>
        </div>
        <div className="heading__wallet-container">
          {!error && !connected && !loading ? (
            <div className="Button" onClick={connect}>
              {t("Connect")}
            </div>
          ) : null}
          {error && !loading ? (
            <div className="heading__error">{error}</div>
          ) : null}
          {/* {connected && !loading ? (
            <div className="heading__wallet">
              <span className="heading__wallet-label">Account: </span>
              <span className="heading__wallet-value">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={"https://etherscan.io/address/" + pubkey}
                >
                  {pubkey.slice(0, 6) +
                    "[...]" +
                    pubkey.slice(pubkey.length - 4, pubkey.length)}
                </a>
              </span>
              <span className="heading__wallet-label">Vesting Balance: </span>
              <span className="heading__wallet-value">{balance} VEGA</span>
            </div>
          ) : null} */}
        </div>
      </div>
      <div className="heading__title-container">
        {isHome ? (
          <div className="heading__title">
            VEGA
            <br />
            {t("Vesting")} 
          </div>
        ) : null}
      </div>
    </header>
  );
};
