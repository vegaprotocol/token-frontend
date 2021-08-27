import "./eth-wallet.scss";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  WalletCard,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { Colors } from "../../colors";

export const EthWallet = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  let content = null;

  if (appState.providerStatus === ProviderStatus.Pending) {
    content = <div>{t("checkingForProvider")}</div>;
  } else if (appState.providerStatus === ProviderStatus.None) {
    content = <div>{t("invalidWeb3Browser")}</div>;
  } else {
    content = <ConnectedKey />;
  }

  return (
    <WalletCard>
      <WalletCardHeader>
        <span>{t("ethereumKey")}</span>
        {appState.address && (
          <>
            <span className="vega-wallet__curr-key">
              {truncateMiddle(appState.address)}
            </span>
          </>
        )}
      </WalletCardHeader>
      <WalletCardContent>{content}</WalletCardContent>
    </WalletCard>
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const connect = useConnect();
  const { appState, appDispatch } = useAppState();
  const {
    connecting,
    address,
    lien,
    walletBalance,
    totalLockedBalance,
    totalVestedBalance,
  } = appState;

  if (connecting) {
    return <div>{t("Awaiting action in wallet...")}</div>;
  }

  if (!address) {
    return (
      <button
        type="button"
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
            isOpen: true,
          })
        }
        data-testid="connect"
        className="eth-wallet__connect"
      >
        {t("Connect")}
      </button>
    );
  }

  return (
    <>
      <WalletCardRow label={t("In Wallet")} dark={true} />
      <WalletCardRow
        label={t("Not Staked")}
        value={walletBalance}
        valueSuffix={t("VEGA")}
      />
      <hr style={{ borderColor: Colors.BLACK, borderTop: 1 }} />
      <WalletCardRow label={t("Vesting")} dark={true} />
      <WalletCardRow
        label={t("Locked")}
        value={totalLockedBalance}
        valueSuffix={t("VEGA")}
      />
      <WalletCardRow
        label={t("Unlocked")}
        value={totalVestedBalance}
        valueSuffix={t("VEGA")}
      />
      <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />
      <WalletCardRow
        label={t("Associated")}
        value={lien}
        valueSuffix={t("VEGA")}
      />
    </>
  );
};
