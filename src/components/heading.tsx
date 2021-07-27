import "./heading.scss";

import React from "react";
import vegaWhite from "../images/vega_white.png";
import { Link, useRouteMatch } from "react-router-dom";

export interface HeadingProps {
  error: string | null;
  connected: boolean;
  loading: boolean;
  pubkey: any;
  connect: () => void;
}

export const Heading = ({
  error,
  connected,
  loading,
  pubkey,
  connect,
}: HeadingProps) => {
  const balance = "123";
  const isHome = useRouteMatch({ path: "/", exact: true });
  console.log(isHome);
  return (
    <div className="Header">
      <div className="Nav">
        <div className="Left">
          <Link to="/">
            <img alt="Vega" src={vegaWhite} className="Logo" />
          </Link>
        </div>
        <div className="Right">
          {!error && !connected && !loading ? (
            <div className="Button" onClick={connect}>
              Connect
            </div>
          ) : null}
          {error && !loading ? (
            <div className="MetaMaskError">{error}</div>
          ) : null}
          {connected && !loading ? (
            <div className="WithdrawPanel Left">
              <span className="WithdrawTitle">Account: </span>
              <span className="WithdrawLabel">
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
              <span className="WithdrawTitle">Vesting Balance: </span>
              <span className="WithdrawLabel">{balance} VEGA</span>
            </div>
          ) : null}
        </div>
        <div className="Clear"></div>
      </div>
      <div className="Inner">
        {isHome ? (
          <div className="Title">
            VEGA
            <br />
            VESTING
          </div>
        ) : null}
      </div>
    </div>
  );
};
