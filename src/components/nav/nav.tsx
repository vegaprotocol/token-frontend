import "./nav.scss";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import vegaWhite from "../../images/vega_white.png";
import debounce from "lodash/debounce";
import { Drawer, Overlay } from "@blueprintjs/core";
import { Routes } from "../../routes/router-config";
import { VegaWallet } from "../vega-wallet";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { EthWallet } from "../eth-wallet";
import { truncateMiddle } from "../../lib/truncate-middle";

export const Nav = () => {
  const { appState, appDispatch } = useAppState();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isDesktop = windowWidth > 960;

  React.useEffect(() => {
    const handleResizeDebounced = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResizeDebounced);

    return () => {
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, []);

  const nav = <NavLinks isDesktop={isDesktop} setDrawerOpen={setDrawerOpen} />;
  const wallets = (
    <div className="nav__wallets-container">
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
            isOpen: true,
          })
        }
      >
        {!appState.vegaKeys
          ? "Connect Vega"
          : `Vega: ${appState.currVegaKey?.pubShort}`}
      </button>
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
            isOpen: true,
          })
        }
      >
        {appState.address
          ? `Eth: ${truncateMiddle(appState.address)}`
          : "Connect Ethereum"}
      </button>
    </div>
  );

  return (
    <>
      <div className={`nav nav-${isDesktop ? "large" : "small"}`}>
        <div className="nav__inner">
          <div className="nav__logo-container">
            <Link to="/">
              <img alt="Vega" src={vegaWhite} className="nav__logo" />
            </Link>
          </div>
          <div className="nav__actions">
            {isDesktop ? (
              <>
                {nav}
                <div style={{ marginLeft: "auto" }}>{wallets}</div>
              </>
            ) : (
              <>
                {wallets}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="nav__drawer-button"
                >
                  <span />
                  <span />
                  <span />
                </button>
                <Drawer
                  isOpen={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  size="80%"
                >
                  <div className="nav__drawer">{nav}</div>
                </Drawer>
              </>
            )}
          </div>
        </div>
      </div>
      <Overlay
        isOpen={appState.vegaWalletOverlay}
        onClose={() =>
          appDispatch({
            type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
            isOpen: false,
          })
        }
        transitionDuration={0}
      >
        <div className="nav-overlay">
          <VegaWallet />
        </div>
      </Overlay>
      <Overlay
        isOpen={appState.ethWalletOverlay}
        onClose={() =>
          appDispatch({
            type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
            isOpen: false,
          })
        }
        transitionDuration={0}
      >
        <div className="nav-overlay">
          <EthWallet />
        </div>
      </Overlay>
    </>
  );
};

export const NavLinks = ({
  isDesktop,
  setDrawerOpen,
}: {
  isDesktop: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
}) => {
  const linkProps = {
    onClick: () => setDrawerOpen(false),
  };
  return (
    <nav className={`nav-links nav-links--${isDesktop ? "row" : "column"}`}>
      <NavLink {...linkProps} to={Routes.TRANCHES}>
        Tranches
      </NavLink>
      <NavLink {...linkProps} to={Routes.STAKING}>
        Staking
      </NavLink>
    </nav>
  );
};
