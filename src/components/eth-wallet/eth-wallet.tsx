import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  WalletCard,
  WalletCardActions,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { Colors, Flags } from "../../config";
import React from "react";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

export const EthWallet = () => {
  const { t } = useTranslation();
  const { connect, disconnect, ethAddress } = useWeb3();
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
            onClick={connect}
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

  const associationsByVegaKey = Object.entries(
    appState.associationBreakdown
  ).filter(([, amount]) => amount.isGreaterThan(0));

  const removeLeadingAddressSymbol = (key: string) => {
    if (key && key.length > 2 && key.slice(0, 2) === "0x") {
      return truncateMiddle(key.substring(2));
    }
    return truncateMiddle(key);
  };

  return (
    <>
      <WalletCardRow
        label={t("vegaInWallet", { symbol: "$VEGA" })}
        value={totalInWallet}
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
      {Flags.REDEEM_DISABLED ? null : (
        <>
          <WalletCardRow
            label={t("VESTING VEGA TOKENS")}
            valueSuffix={t("VEGA")}
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
      {Flags.STAKING_DISABLED || Flags.REDEEM_DISABLED ? null : (
        <>
          {associationsByVegaKey.length ? (
            <>
              <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />
              <WalletCardRow label="Associated to" dark={true} />
              {associationsByVegaKey.map(([key, amount]) => {
                return (
                  <WalletCardRow
                    key={key}
                    label={removeLeadingAddressSymbol(key)}
                    value={amount}
                    valueSuffix={t("VEGA")}
                  />
                );
              })}
            </>
          ) : null}
        </>
      )}
    </>
  );
};
