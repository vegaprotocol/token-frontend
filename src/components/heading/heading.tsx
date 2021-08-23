import "./heading.scss";

import vegaWhite from "../../images/vega_white.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConnect } from "../../hooks/use-connect";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { EthereumChainId, EthereumChainIds } from "../../lib/web3-utils";
import { truncateMiddle } from "../../lib/truncate-middle";
import { PixelatedText } from "../pixelated-text";
import { Flags } from "../../flags";

export interface HeadingProps {
  title: string;
}

export const Heading = ({ title }: HeadingProps) => {
  const { appState } = useAppState();
  return (
    <header className="heading">
      <div className="heading__nav">
        <div className="heading__logo-container">
          <Link to="/">
            <img alt="Vega" src={vegaWhite} className="heading__logo" />
          </Link>
        </div>
        <div className="heading__wallet-container">
          {appState.providerStatus === ProviderStatus.Ready && (
            <>
              <ConnectedKey />
              {Flags.SHOW_NETWORK_SWITCHER && <NetworkSwitcher />}
            </>
          )}
        </div>
      </div>
      <div className="heading__title-container">
        <h1 className="heading__title">
          <PixelatedText text={title} />
        </h1>
      </div>
    </header>
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const connect = useConnect();
  const { appState } = useAppState();
  const { connecting, address, error, balanceFormatted } = appState;

  if (error) {
    return <div className="heading__error">{t("Something went wrong")}</div>;
  }

  if (connecting) {
    return (
      <div className="heading__wallet">{t("Awaiting action in wallet...")}</div>
    );
  }

  if (!address) {
    return <button onClick={connect}>{t("Connect")}</button>;
  }

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
            {truncateMiddle(address)}
          </a>
        </span>
      </div>
      <div>
        <span className="heading__wallet-label">{t("Vesting Balance")}: </span>
        <span className="heading__wallet-value">
          {balanceFormatted} {t("VEGA")}
        </span>
      </div>
    </div>
  );
};

export const NetworkSwitcher = () => {
  const {
    appState: { appChainId },
    appDispatch,
  } = useAppState();
  return (
    <select
      value={appChainId}
      style={{ padding: 4 }}
      onChange={(e) => {
        appDispatch({
          type: AppStateActionType.APP_CHAIN_CHANGED,
          newChainId: e.target.value as EthereumChainId,
        });
      }}
    >
      {Object.entries(EthereumChainIds).map(([name, val]) => (
        <option
          key={val}
          value={val}
          disabled={
            ![EthereumChainIds.Ropsten, EthereumChainIds.Mainnet].includes(val)
          }
        >
          {name}
        </option>
      ))}
    </select>
  );
};
