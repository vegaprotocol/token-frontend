import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  WalletCard,
  WalletCardActions,
  WalletCardAsset,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { Colors, Flags } from "../../config";
import React from "react";
import vegaWhite from "../../images/vega_white.png";
import vegaVesting from "../../images/vega_vesting.png";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { Routes } from "../../routes/router-config";
import { Link } from "react-router-dom";
import { LockedProgress } from "../locked-progress";
import { BigNumber } from "../../lib/bignumber";

const removeLeadingAddressSymbol = (key: string) => {
  if (key && key.length > 2 && key.slice(0, 2) === "0x") {
    return truncateMiddle(key.substring(2));
  }
  return truncateMiddle(key);
};

const AssociatedAmounts = ({
  associations,
  total,
}: {
  associations: { [key: string]: BigNumber };
  total: BigNumber;
}) => {
  const { t } = useTranslation();
  const vestingAssociationByVegaKey = React.useMemo(
    () =>
      Object.entries(associations).filter(([, amount]) =>
        amount.isGreaterThan(0)
      ),
    [associations]
  );
  const associationAmounts = React.useMemo(() => {
    const totals = vestingAssociationByVegaKey.map(([, amount]) => amount);
    const associated = BigNumber.sum.apply(null, [new BigNumber(0), ...totals]);
    return {
      total,
      associated,
      notAssociated: total.minus(associated),
    };
  }, [total, vestingAssociationByVegaKey]);

  return (
    <>
      {Flags.STAKING_DISABLED ? null : (
        <>
          <LockedProgress
            locked={associationAmounts.associated}
            unlocked={associationAmounts.notAssociated}
            total={associationAmounts.total}
            leftLabel={t("associated")}
            rightLabel={t("notAssociated")}
            leftColor={Colors.WHITE}
            rightColor={Colors.BLACK}
            light={true}
          />
        </>
      )}
      {Flags.STAKING_DISABLED || Flags.REDEEM_DISABLED ? null : (
        <>
          {vestingAssociationByVegaKey.length ? (
            <>
              <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />
              <WalletCardRow label="Associated with Vega keys" bold={true} />
              {vestingAssociationByVegaKey.map(([key, amount]) => {
                return (
                  <WalletCardRow
                    key={key}
                    label={removeLeadingAddressSymbol(key)}
                    value={amount}
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
      <WalletCardAsset
        image={vegaVesting}
        decimals={appState.decimals}
        name="VEGA"
        symbol="In vesting contract"
        balance={totalInVestingContract}
      />
      {Flags.REDEEM_DISABLED ? null : (
        <>
          <LockedProgress
            locked={totalLockedBalance}
            unlocked={totalVestedBalance}
            total={totalVestedBalance.plus(totalLockedBalance)}
            leftLabel={t("Locked")}
            rightLabel={t("Unlocked")}
            light={true}
          />
        </>
      )}
      <AssociatedAmounts
        associations={appState.associationBreakdown.stakingAssociations}
        total={totalInVestingContract}
      />
      <WalletCardAsset
        image={vegaWhite}
        decimals={appState.decimals}
        name="VEGA"
        symbol="In Wallet"
        balance={totalInWallet}
      />
      <AssociatedAmounts
        associations={appState.associationBreakdown.vestingAssociations}
        total={totalInWallet}
      />
      {Flags.STAKING_DISABLED ? null : (
        <WalletCardActions>
          <Link style={{ flex: 1 }} to={`${Routes.STAKING}/associate`}>
            <button className="button-secondary button-secondary--light">
              {t("associate")}
            </button>
          </Link>
          <Link style={{ flex: 1 }} to={`${Routes.STAKING}/disassociate`}>
            <button className="button-secondary button-secondary--light">
              {t("disassociate")}
            </button>
          </Link>
        </WalletCardActions>
      )}
    </>
  );
};

export const EthWallet = () => {
  const { t } = useTranslation();
  const { connect, disconnect, ethAddress } = useWeb3();
  const [disconnecting] = React.useState(false);

  return (
    <WalletCard>
      <WalletCardHeader>
        <h1>{t("ethereumKey")}</h1>
        {ethAddress && (
          <span className="vega-wallet__curr-key">
            {truncateMiddle(ethAddress)}
          </span>
        )}
      </WalletCardHeader>
      <WalletCardContent>
        {ethAddress ? (
          <ConnectedKey />
        ) : (
          <button
            type="button"
            className="button-link button-link--dark"
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
