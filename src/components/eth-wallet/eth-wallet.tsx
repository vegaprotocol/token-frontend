import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Colors } from "../../config";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useWeb3 } from "../../hooks/use-web3";
import vegaVesting from "../../images/vega_vesting.png";
import vegaWhite from "../../images/vega_white.png";
import { BigNumber } from "../../lib/bignumber";
import { injected } from "../../lib/connectors";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Routes } from "../../routes/router-config";
import { LockedProgress } from "../locked-progress";
import {
  WalletCard,
  WalletCardActions,
  WalletCardAsset,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";

const removeLeadingAddressSymbol = (key: string) => {
  if (key && key.length > 2 && key.slice(0, 2) === "0x") {
    return truncateMiddle(key.substring(2));
  }
  return truncateMiddle(key);
};

const AssociatedAmounts = ({
  associations,
  notAssociated,
}: {
  associations: { [key: string]: BigNumber };
  notAssociated: BigNumber;
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
      total: associated.plus(notAssociated),
      associated,
      notAssociated,
    };
  }, [notAssociated, vestingAssociationByVegaKey]);

  return (
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
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { walletBalance, totalLockedBalance, totalVestedBalance } = appState;

  const totalInVestingContract = React.useMemo(() => {
    return totalLockedBalance.plus(totalVestedBalance);
  }, [totalLockedBalance, totalVestedBalance]);

  const notAssociatedInContract = React.useMemo(() => {
    const totals = Object.values(
      appState.associationBreakdown.vestingAssociations
    );
    const associated = BigNumber.sum.apply(null, [new BigNumber(0), ...totals]);
    return totalInVestingContract.minus(associated);
  }, [
    appState.associationBreakdown.vestingAssociations,
    totalInVestingContract,
  ]);

  const walletWithAssociations = React.useMemo(() => {
    const totals = Object.values(
      appState.associationBreakdown.stakingAssociations
    );
    const associated = BigNumber.sum.apply(null, [new BigNumber(0), ...totals]);
    return walletBalance.plus(associated);
  }, [appState.associationBreakdown.stakingAssociations, walletBalance]);

  return (
    <>
      {totalVestedBalance.plus(totalLockedBalance).isEqualTo(0) ? null : (
        <>
          <WalletCardAsset
            image={vegaVesting}
            decimals={appState.decimals}
            name="VEGA"
            symbol="In vesting contract"
            balance={totalInVestingContract}
          />
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
      {!Object.keys(appState.associationBreakdown.vestingAssociations)
        .length ? null : (
        <AssociatedAmounts
          associations={appState.associationBreakdown.vestingAssociations}
          notAssociated={notAssociatedInContract}
        />
      )}
      <WalletCardAsset
        image={vegaWhite}
        decimals={appState.decimals}
        name="VEGA"
        symbol="In Wallet"
        balance={walletWithAssociations}
      />
      {!Object.keys(
        appState.associationBreakdown.stakingAssociations
      ) ? null : (
        <AssociatedAmounts
          associations={appState.associationBreakdown.stakingAssociations}
          notAssociated={walletBalance}
        />
      )}
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
    </>
  );
};

export const EthWallet = () => {
  const { t } = useTranslation();
  const { activate, deactivate, account } = useWeb3();
  const [disconnecting] = React.useState(false);

  return (
    <WalletCard>
      <WalletCardHeader>
        <h1>{t("ethereumKey")}</h1>
        {account && (
          <span className="vega-wallet__curr-key">
            {truncateMiddle(account)}
          </span>
        )}
      </WalletCardHeader>
      <WalletCardContent>
        {account ? (
          <ConnectedKey />
        ) : (
          <button
            type="button"
            className="fill button-secondary--inverted"
            onClick={() => activate(injected)}
            data-test-id="connect-to-eth-wallet-button"
          >
            {t("connectEthWalletToAssociate")}
          </button>
        )}
        {account && (
          <WalletCardActions>
            <button
              className="button-link button-link--dark"
              onClick={deactivate}
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
