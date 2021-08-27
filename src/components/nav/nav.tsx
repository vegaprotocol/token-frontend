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
import { useTranslation } from "react-i18next";
import { useConnect } from "../../hooks/use-connect";
import { VegaWalletForm } from "../vega-wallet/vega-wallet-form";

export const Nav = () => {
  const { t } = useTranslation();
  const connect = useConnect();
  const { appState, appDispatch } = useAppState();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isDesktop = windowWidth > 959;

  React.useEffect(() => {
    const handleResizeDebounced = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResizeDebounced);

    return () => {
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, []);

  const nav = (
    <NavLinks
      isDesktop={isDesktop}
      setDrawerOpen={(isOpen) =>
        appDispatch({ type: AppStateActionType.SET_DRAWER, isOpen })
      }
    />
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
              nav
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    appDispatch({
                      type: AppStateActionType.SET_DRAWER,
                      isOpen: true,
                    })
                  }
                  className="nav__drawer-button"
                >
                  <span />
                  <span />
                  <span />
                </button>
                <Drawer
                  isOpen={appState.drawerOpen}
                  onClose={() =>
                    appDispatch({
                      type: AppStateActionType.SET_DRAWER,
                      isOpen: false,
                    })
                  }
                  size="80%"
                >
                  <div className="nav__drawer">
                    <div>
                      <div className="nav__drawer-section">
                        <VegaWallet />
                      </div>
                      <div className="nav__drawer-section">
                        <EthWallet />
                      </div>
                    </div>
                    {nav}
                  </div>
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
          <VegaWalletForm
            onConnect={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: false,
              })
            }
          />
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
          <div>
            <button
              type="button"
              onClick={connect}
              data-testid="connect"
              className="eth-wallet__connect"
            >
              {t("Connect with Metamask")}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => alert("Coming soon")}
              data-testid="connect"
              className="eth-wallet__connect"
            >
              {t("Connect with Ledger")}
            </button>
          </div>
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
      <NavLink {...linkProps} to={Routes.VESTING}>
        Vesting
      </NavLink>
      <NavLink {...linkProps} to={Routes.TRANCHES}>
        Tranches
      </NavLink>
      <NavLink {...linkProps} to={Routes.STAKING}>
        Staking
      </NavLink>
    </nav>
  );
};
