import "./heading.scss";

import React from "react";
import vegaWhite from "../images/vega_white.png";

export interface HeadingProps {
  error: string | null;
  connected: boolean;
  loading: boolean;
  pubkey: any;
}

export const Heading = ({
  error,
  connected,
  loading,
  pubkey,
}: HeadingProps) => {
  const balance = "123";
  return (
    <div className="Header">
      <div className="Nav">
        <div className="Left">
          <img
            alt="Vega"
            src={vegaWhite}
            // onClick={() => (window.top.location = "/")} TODO logo should redirect to
            className="Logo"
          />
        </div>
        <div className="Right">
          {!error && !connected && !loading ? (
            <div
              className="Button"
              // onClick={() => connect()}
            >
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
        {true ? ( // TODO test if we on home
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
