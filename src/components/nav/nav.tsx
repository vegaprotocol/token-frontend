import "./nav.scss";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import vegaWhite from "../../images/vega_white.png";
import debounce from "lodash/debounce";
import { Drawer } from "@blueprintjs/core";
import { Routes } from "../../routes/router-config";
import { VegaWallet } from "../vega-wallet";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { EthWallet } from "../eth-wallet";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "./breadcrumbs";
import {Flags} from "../../config";

export const Nav = () => {
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

  return (
    <div className={`nav nav-${isDesktop ? "large" : "small"}`}>
      <div className="nav__inner">
        <div className="nav__logo-container">
          <Link to="/">
            <img alt="Vega" src={vegaWhite} className="nav__logo" />
          </Link>
        </div>
        <div className="nav__actions">
          {isDesktop ? <NavLinks isDesktop={isDesktop} /> : <NavDrawer />}
        </div>
      </div>
      <Breadcrumbs />
    </div>
  );
};

const NavDrawer = () => {
  const { appState, appDispatch } = useAppState();
  return (
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
          <NavLinks isDesktop={false} />
        </div>
      </Drawer>
    </>
  );
};

const NavLinks = ({ isDesktop }: { isDesktop: boolean }) => {
  const { appDispatch } = useAppState();
  const { t } = useTranslation();
  const linkProps = {
    onClick: () =>
      appDispatch({ type: AppStateActionType.SET_DRAWER, isOpen: false }),
  };
  return (
    <nav className={`nav-links nav-links--${isDesktop ? "row" : "column"}`}>
      {Flags.DEX_STAKING_DISABLED ? null :
        (<NavLink {...linkProps} to={Routes.VESTING}>
          {t("Vesting")}
        </NavLink>)}
      <NavLink {...linkProps} to={Routes.STAKING}>
        {t("Staking")}
      </NavLink>
      <NavLink {...linkProps} to={Routes.GOVERNANCE}>
        {t("Governance")}
      </NavLink>
      {Flags.DEX_STAKING_DISABLED ? null :
        <NavLink {...linkProps} to={Routes.LIQUIDITY}>
          {t("liquidityNav")}
        </NavLink>}
    </nav>
  );
};
