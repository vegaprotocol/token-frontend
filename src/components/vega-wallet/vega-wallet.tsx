import React from "react";
import "./vega-wallet.scss";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
  VegaWalletStatus,
} from "../../contexts/app-state/app-state-context";
import {
  WalletCard,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { VegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import { useVegaStaking } from "../../hooks/use-vega-staking";

export const VegaWallet = () => {
  const { t } = useTranslation();
  const vegaWallet = useVegaWallet();
  const { appState } = useAppState();

  const child = !appState.vegaKeys ? (
    <VegaWalletNotConnected />
  ) : (
    <VegaWalletConnected
      vegaWallet={vegaWallet}
      currVegaKey={appState.currVegaKey}
      vegaKeys={appState.vegaKeys}
    />
  );

  return (
    <WalletCard>
      <WalletCardHeader>
        <span>
          {t("vegaKey")}{" "}
          {appState.currVegaKey && `(${appState.currVegaKey.alias})`}
        </span>
        {appState.currVegaKey && (
          <>
            <span className="vega-wallet__curr-key">
              {appState.currVegaKey.pubShort}
            </span>
          </>
        )}
      </WalletCardHeader>
      <WalletCardContent>{child}</WalletCardContent>
    </WalletCard>
  );
};

const VegaWalletNotConnected = () => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();

  if (appState.vegaWalletStatus === VegaWalletStatus.None) {
    return (
      <WalletCardContent>
        <div>{t("noService")}</div>
      </WalletCardContent>
    );
  }

  return (
    <button
      onClick={() =>
        appDispatch({
          type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
          isOpen: true,
        })
      }
      className="vega-wallet__connect"
      data-testid="connect-vega"
      type="button"
    >
      {t("connectVegaWallet")}
    </button>
  );
};

interface VegaWalletConnectedProps {
  vegaWallet: VegaWalletService;
  currVegaKey: VegaKeyExtended | null;
  vegaKeys: VegaKeyExtended[];
}

const VegaWalletConnected = ({
  vegaWallet,
  currVegaKey,
  vegaKeys,
}: VegaWalletConnectedProps) => {
  const { t } = useTranslation();
  const {
    appDispatch,
    appState: { address, vegaAssociatedBalance },
  } = useAppState();
  const [disconnecting, setDisconnecting] = React.useState(false);
  const staking = useVegaStaking();
  const [expanded, setExpanded] = React.useState(false);

  const handleDisconnect = React.useCallback(
    async function () {
      setDisconnecting(true);
      await vegaWallet.revokeToken();
      appDispatch({ type: AppStateActionType.VEGA_WALLET_DISCONNECT });
    },
    [appDispatch, vegaWallet]
  );

  const changeKey = React.useCallback(
    async (k: VegaKeyExtended) => {
      let vegaAssociatedBalance = null;
      if (address) {
        vegaAssociatedBalance = await staking.stakeBalance(address, k.pub);
      }
      appDispatch({
        type: AppStateActionType.VEGA_WALLET_SET_KEY,
        key: k,
        vegaAssociatedBalance: vegaAssociatedBalance,
      });
      setExpanded(false);
    },
    [address, appDispatch, staking]
  );

  return vegaKeys.length ? (
    <>
      {vegaAssociatedBalance ? (
        <WalletCardRow
          label={t("Not staked")}
          value={vegaAssociatedBalance}
          valueSuffix={t("VEGA")}
        />
      ) : null}
      {expanded && (
        <ul className="vega-wallet__key-list">
          {vegaKeys
            .filter((k) => currVegaKey && currVegaKey.pub !== k.pub)
            .map((k) => (
              <li key={k.pub} onClick={() => changeKey(k)}>
                {k.alias} {k.pubShort}
              </li>
            ))}
        </ul>
      )}
      <div className="vega-wallet__actions">
        <button
          className="button-link button-link--dark"
          onClick={() => setExpanded((x) => !x)}
          type="button"
        >
          {expanded ? "Hide keys" : "Change key"}
        </button>
        <button
          className="button-link button-link--dark"
          onClick={handleDisconnect}
          type="button"
        >
          {disconnecting ? t("awaitingDisconnect") : t("disconnect")}
        </button>
      </div>
    </>
  ) : (
    <WalletCardContent>{t("noKeys")}</WalletCardContent>
  );
};
