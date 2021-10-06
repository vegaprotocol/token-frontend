import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  WalletCard,
  WalletCardActions,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { useEthUser } from "../../hooks/use-eth-user";
import { Colors, Flags } from "../../config";
import React from "react";

export const EthWallet = () => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const { ethAddress, disconnect } = useEthUser();
  const [disconnecting] = React.useState(false);

  return (
    <WalletCard>
      <WalletCardHeader>
        <span>{t("ethereumKey")}</span>
        {ethAddress && (
          <>
            <span className="vega-wallet__curr-key">
              {truncateMiddle(ethAddress)}
            </span>
          </>
        )}
      </WalletCardHeader>
      <WalletCardContent>
        {ethAddress ? (
          <ConnectedKey />
        ) : (
          <button
            type="button"
            className="button-link"
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
                isOpen: true,
              })
            }
            data-testid="connect"
          >
            {t("Connect to an Ethereum wallet")}
          </button>
        )}
        {ethAddress && (
          <WalletCardActions>
            <button
              className="button-link button-link--dark"
              onClick={disconnect}
              type="button"
            >
              {disconnecting ? t("awaitingDisconnect") : t("disconnect")}
            </button>
          </WalletCardActions>
        )}
      </WalletCardContent>
    </WalletCard>
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { lien, walletBalance, totalLockedBalance, totalVestedBalance } =
    appState;
  const totalInWallet = React.useMemo(() => {
    return walletBalance.plus(lien);
  }, [lien, walletBalance]);
  const totalInVestingContract = React.useMemo(() => {
    return totalLockedBalance.plus(totalVestedBalance);
  }, [totalLockedBalance, totalVestedBalance]);

  return (
    <>
      <WalletCardRow
        label={t("VEGA in wallet")}
        value={totalInWallet}
        dark={true}
        valueSuffix={t("VEGA")}
      />
      {Flags.STAKING_DISABLED ? null : (
        <WalletCardRow
          label={t("Not Associated")}
          value={walletBalance}
          valueSuffix={t("VEGA")}
        />
      )}
      {Flags.STAKING_DISABLED ? null : (
        <WalletCardRow
          label={t("Associated")}
          value={lien}
          valueSuffix={t("VEGA")}
        />
      )}
      <hr style={{ borderColor: Colors.BLACK, borderTop: 1 }} />
      {Flags.VESTING_DISABLED ? null : (
        <>
          <WalletCardRow
            label={t("VESTING VEGA TOKENS")}
            valueSuffix={t("VEGA")}
            dark={true}
            value={totalInVestingContract}
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
        </>
      )}
      {Flags.STAKING_DISABLED || Flags.VESTING_DISABLED ? null : (
        <>
          <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />
          <WalletCardRow
            label={t("Associated")}
            value={lien}
            valueSuffix={t("VEGA")}
          />
        </>
      )}
    </>
  );
};
