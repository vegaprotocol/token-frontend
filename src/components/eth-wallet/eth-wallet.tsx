import "./eth-wallet.scss";
import { useTranslation } from "react-i18next";
import {
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
import { BigNumber } from "../../lib/bignumber";

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
  const { appState } = useAppState();
  const {
    connecting,
    address,
    error,
    balanceFormatted,
    lien,
    walletBalance,
    totalLockedBalance,
    totalVestedBalance,
  } = appState;

  if (error) {
    return <div>{t("Something went wrong")}</div>;
  }

  if (connecting) {
    return <div>{t("Awaiting action in wallet...")}</div>;
  }

  if (!address) {
    return (
      <button
        type="button"
        onClick={connect}
        data-testid="connect"
        className="eth-wallet__connect"
      >
        {t("Connect")}
      </button>
    );
  }

  return (
    <>
      <WalletCardRow label={t("Wallet")} />
      <WalletCardRow
        label={t("Balance")}
        value={walletBalance}
        valueSuffix={t("VEGA")}
      />
      <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />

      <WalletCardRow
        label={t("Vesting")}
        value={balanceFormatted}
        valueSuffix={t("VEGA")}
      />

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
        label={t("Total")}
        value={new BigNumber(walletBalance)
          .plus(totalLockedBalance)
          .plus(totalVestedBalance)
          .toString()}
        valueSuffix={t("VEGA")}
      />
      <hr />
      <WalletCardRow label={t("Staking")} />
      <WalletCardRow
        label={t("Unassociated")}
        value={new BigNumber(balanceFormatted).minus(lien).toString()}
        valueSuffix={t("VEGA")}
      />
      <WalletCardRow
        label={t("Associated")}
        value={lien}
        valueSuffix={t("VEGA")}
      />
      <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />
      <WalletCardRow label={t("Staked")} value={"0"} valueSuffix={t("VEGA")} />
    </>
  );
};
