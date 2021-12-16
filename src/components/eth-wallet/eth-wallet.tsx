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
import { Colors } from "../../config";
import React from "react";
import vegaWhite from "../../images/vega_white.png";
import vegaVesting from "../../images/vega_vesting.png";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { Routes } from "../../routes/router-config";
import { Link } from "react-router-dom";
import { LockedProgress } from "../locked-progress";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import { EthereumChainIds } from "../../lib/web3-utils";

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
  const { connect, disconnect, ethAddress, gas, chainId } = useWeb3();
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
      <WalletCardHeader>
        {gas && chainId === EthereumChainIds.Mainnet ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z"
              />
            </svg>
            {formatNumber(gas, 0)}
          </div>
        ) : null}
      </WalletCardHeader>
      <WalletCardContent>
        {ethAddress ? (
          <ConnectedKey />
        ) : (
          <button
            type="button"
            className="fill button-secondary--inverted"
            onClick={connect}
            data-test-id="connect-to-eth-wallet-button"
          >
            {t("connectEthWalletToAssociate")}
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
