import "./vega-wallet.scss";

import { gql, useApolloClient } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { useWeb3React } from "@web3-react/core";
import { keyBy, uniq } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AccountType } from "../../__generated__/globalTypes";
import { ADDRESSES, Colors } from "../../config";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { useRefreshAssociatedBalances } from "../../hooks/use-refresh-associated-balances";
import { useVegaUser } from "../../hooks/use-vega-user";
import noIcon from "../../images/token-no-icon.png";
import vegaBlack from "../../images/vega_black.png";
import vegaWhite from "../../images/vega_white.png";
import { BigNumber } from "../../lib/bignumber";
import { addDecimal } from "../../lib/decimals";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  MINIMUM_WALLET_VERSION,
  vegaWalletService,
} from "../../lib/vega-wallet/vega-wallet-service";
import { Routes } from "../../routes/router-config";
import { BulletHeader } from "../bullet-header";
import {
  WalletCard,
  WalletCardActions,
  WalletCardAsset,
  WalletCardAssetProps,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import {
  Delegations,
  Delegations_party_delegations,
  DelegationsVariables,
} from "./__generated__/Delegations";
import { DownloadWalletPrompt } from "./download-wallet-prompt";

const DELEGATIONS_QUERY = gql`
  query Delegations($partyId: ID!) {
    epoch {
      id
    }
    party(id: $partyId) {
      id
      delegations {
        amountFormatted @client
        amount
        node {
          id
          name
        }
        epoch
      }
      stake {
        currentStakeAvailable
        currentStakeAvailableFormatted @client
      }
      accounts {
        asset {
          name
          id
          decimals
          symbol
          source {
            __typename
            ... on ERC20 {
              contractAddress
            }
          }
        }
        type
        balance
      }
    }
  }
`;

export const VegaWallet = () => {
  const { t } = useTranslation();
  const { currVegaKey, vegaKeys, version } = useVegaUser();

  const child = !vegaKeys ? (
    <VegaWalletNotConnected />
  ) : (
    <VegaWalletConnected
      currVegaKey={currVegaKey}
      vegaKeys={vegaKeys}
      version={version}
    />
  );

  return (
    <section className="vega-wallet">
      <WalletCard dark={true}>
        <WalletCardHeader dark={true}>
          <div>
            <h1>{t("vegaWallet")}</h1>
            <span style={{ marginLeft: 8, marginRight: 8 }}>
              {currVegaKey && `(${currVegaKey.alias})`}
            </span>
          </div>
          {currVegaKey && (
            <span className="vega-wallet__curr-key">
              {currVegaKey.pubShort}
            </span>
          )}
        </WalletCardHeader>
        <WalletCardContent>{child}</WalletCardContent>
      </WalletCard>
    </section>
  );
};

const VegaWalletNotConnected = () => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();

  return (
    <>
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
            isOpen: true,
          })
        }
        className="fill button-secondary"
        data-testid="connect-vega"
        type="button"
      >
        {t("connectVegaWalletToUseAssociated")}
      </button>
      <DownloadWalletPrompt />
    </>
  );
};

interface VegaWalletAssetsListProps {
  accounts: WalletCardAssetProps[];
}

const VegaWalletAssetList = ({ accounts }: VegaWalletAssetsListProps) => {
  const { t } = useTranslation();
  if (!accounts.length) {
    return null;
  }
  return (
    <>
      <WalletCardHeader>
        <BulletHeader style={{ border: "none" }} tag="h2">
          {t("assets")}
        </BulletHeader>
      </WalletCardHeader>
      {accounts.map((a, i) => (
        <WalletCardAsset key={i} {...a} dark={true} />
      ))}
    </>
  );
};

interface VegaWalletConnectedProps {
  currVegaKey: VegaKeyExtended | null;
  vegaKeys: VegaKeyExtended[];
  version: string | undefined;
}

const VegaWalletConnected = ({
  currVegaKey,
  vegaKeys,
  version,
}: VegaWalletConnectedProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const {
    appDispatch,
    appState: { decimals },
  } = useAppState();
  const setAssociatedBalances = useRefreshAssociatedBalances();
  const [disconnecting, setDisconnecting] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const client = useApolloClient();
  const [delegations, setDelegations] = React.useState<
    Delegations_party_delegations[]
  >([]);
  const [delegatedNodes, setDelegatedNodes] = React.useState<
    {
      nodeId: string;
      name: string;
      hasStakePending: boolean;
      currentEpochStake?: BigNumber;
      nextEpochStake?: BigNumber;
    }[]
  >([]);
  const [accounts, setAccounts] = React.useState<WalletCardAssetProps[]>([]);
  const [currentStakeAvailable, setCurrentStakeAvailable] =
    React.useState<BigNumber>(new BigNumber(0));

  React.useEffect(() => {
    let interval: any;
    let mounted = true;

    if (currVegaKey?.pub) {
      // start polling for delegation
      interval = setInterval(() => {
        client
          .query<Delegations, DelegationsVariables>({
            query: DELEGATIONS_QUERY,
            variables: { partyId: currVegaKey.pub },
            fetchPolicy: "network-only",
          })
          .then((res) => {
            if (!mounted) return;
            const filter =
              res.data.party?.delegations?.filter((d) => {
                return d.epoch.toString() === res.data.epoch.id;
              }) || [];
            const sortedDelegations = [...filter].sort((a, b) => {
              return new BigNumber(b.amountFormatted)
                .minus(a.amountFormatted)
                .toNumber();
            });
            setDelegations(sortedDelegations);
            setCurrentStakeAvailable(
              new BigNumber(
                res.data.party?.stake.currentStakeAvailableFormatted || 0
              )
            );
            const accounts = res.data.party?.accounts || [];
            setAccounts(
              accounts
                .filter((a) => a.type === AccountType.General)
                .map((a) => {
                  const isVega =
                    a.asset.source.__typename === "ERC20" &&
                    a.asset.source.contractAddress ===
                      ADDRESSES.vegaTokenAddress;

                  return {
                    isVega,
                    name: a.asset.name,
                    subheading: isVega ? t("collateral") : a.asset.symbol,
                    symbol: a.asset.symbol,
                    decimals: a.asset.decimals,
                    balance: new BigNumber(
                      addDecimal(new BigNumber(a.balance), a.asset.decimals)
                    ),
                    image: isVega ? vegaBlack : noIcon,
                    border: isVega,
                    address:
                      a.asset.source.__typename === "ERC20"
                        ? a.asset.source.contractAddress
                        : undefined,
                  };
                })
                .sort((a, b) => {
                  // Put VEGA at the top of the list
                  if (a.isVega) {
                    return -1;
                  }
                  if (b.isVega) {
                    return 1;
                  }
                  // Secondary sort by name
                  if (a.name < b.name) {
                    return -1;
                  }
                  if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                })
            );
            const delegatedNextEpoch = keyBy(
              res.data.party?.delegations?.filter((d) => {
                return d.epoch === Number(res.data.epoch.id) + 1;
              }) || [],
              "node.id"
            );
            const delegatedThisEpoch = keyBy(
              res.data.party?.delegations?.filter((d) => {
                return d.epoch === Number(res.data.epoch.id);
              }) || [],
              "node.id"
            );
            const nodesDelegated = uniq([
              ...Object.keys(delegatedNextEpoch),
              ...Object.keys(delegatedThisEpoch),
            ]);

            const delegatedAmounts = nodesDelegated
              .map((d) => ({
                nodeId: d,
                name:
                  delegatedThisEpoch[d]?.node?.name ||
                  delegatedNextEpoch[d]?.node?.name,
                hasStakePending: !!(
                  (delegatedThisEpoch[d]?.amountFormatted ||
                    delegatedNextEpoch[d]?.amountFormatted) &&
                  delegatedThisEpoch[d]?.amountFormatted !==
                    delegatedNextEpoch[d]?.amountFormatted &&
                  delegatedNextEpoch[d] !== undefined
                ),
                currentEpochStake:
                  delegatedThisEpoch[d] &&
                  new BigNumber(delegatedThisEpoch[d].amountFormatted),
                nextEpochStake:
                  delegatedNextEpoch[d] &&
                  new BigNumber(delegatedNextEpoch[d].amountFormatted),
              }))
              .sort((a, b) => {
                if (
                  new BigNumber(a.currentEpochStake || 0).isLessThan(
                    b.currentEpochStake || 0
                  )
                )
                  return 1;
                if (
                  new BigNumber(a.currentEpochStake || 0).isGreaterThan(
                    b.currentEpochStake || 0
                  )
                )
                  return -1;
                if ((!a.name && b.name) || a.name < b.name) return 1;
                if ((!b.name && a.name) || a.name > b.name) return -1;
                if (a.nodeId > b.nodeId) return 1;
                if (a.nodeId < b.nodeId) return -1;
                return 0;
              });

            setDelegatedNodes(delegatedAmounts);
          })
          .catch((err: Error) => {
            Sentry.captureException(err);
            // If query fails stop interval. Its almost certain that the query
            // will just continue to fail
            clearInterval(interval);
          });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      mounted = false;
    };
  }, [client, currVegaKey?.pub, t]);

  const handleDisconnect = React.useCallback(
    async function () {
      try {
        setDisconnecting(true);
        await vegaWalletService.revokeToken();
        appDispatch({ type: AppStateActionType.VEGA_WALLET_DISCONNECT });
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    [appDispatch]
  );

  const unstaked = React.useMemo(() => {
    const totalDelegated = delegations.reduce<BigNumber>(
      (acc, cur) => acc.plus(cur.amountFormatted),
      new BigNumber(0)
    );
    return BigNumber.max(currentStakeAvailable.minus(totalDelegated), 0);
  }, [currentStakeAvailable, delegations]);

  const changeKey = React.useCallback(
    async (k: VegaKeyExtended) => {
      if (account) {
        await setAssociatedBalances(account, k.pub);
      }
      vegaWalletService.setKey(k.pub);
      appDispatch({
        type: AppStateActionType.VEGA_WALLET_SET_KEY,
        key: k,
      });
      setExpanded(false);
    },
    [account, appDispatch, setAssociatedBalances]
  );

  const footer = (
    <WalletCardActions>
      {version ? <div className="vega-wallet__version">{version}</div> : null}
      {vegaKeys.length > 1 ? (
        <button
          className="button-link"
          onClick={() => setExpanded((x) => !x)}
          type="button"
        >
          {expanded ? "Hide keys" : "Change key"}
        </button>
      ) : null}
      <button className="button-link" onClick={handleDisconnect} type="button">
        {disconnecting ? t("awaitingDisconnect") : t("disconnect")}
      </button>
    </WalletCardActions>
  );

  if (!version) {
    return (
      <>
        <div
          style={{
            color: Colors.RED,
          }}
        >
          {t("noVersionFound")}
        </div>
        {footer}
      </>
    );
  } else if (!vegaWalletService.isSupportedVersion(version)) {
    return (
      <>
        <div
          style={{
            color: Colors.RED,
          }}
        >
          {t("unsupportedVersion", {
            version,
            requiredVersion: MINIMUM_WALLET_VERSION,
          })}
        </div>
        {footer}
      </>
    );
  }

  return vegaKeys.length ? (
    <>
      <WalletCardAsset
        image={vegaWhite}
        decimals={decimals}
        name="VEGA"
        subheading={t("Associated")}
        symbol="VEGA"
        balance={currentStakeAvailable}
        dark={true}
      />
      <WalletCardRow label={t("unstaked")} value={unstaked} dark={true} />
      {delegatedNodes.length ? (
        <WalletCardRow label={t("stakedValidators")} dark={true} bold={true} />
      ) : null}
      {delegatedNodes.map((d) => (
        <div key={d.nodeId}>
          {d.currentEpochStake && d.currentEpochStake.isGreaterThan(0) && (
            <WalletCardRow
              label={`${d.name || truncateMiddle(d.nodeId)} ${
                d.hasStakePending ? `(${t("thisEpoch")})` : ""
              }`}
              link={`${Routes.STAKING}/${d.nodeId}`}
              value={d.currentEpochStake}
              dark={true}
            />
          )}
          {d.hasStakePending && (
            <WalletCardRow
              label={`${d.name || truncateMiddle(d.nodeId)} (${t(
                "nextEpoch"
              )})`}
              link={`${Routes.STAKING}/${d.nodeId}`}
              value={d.nextEpochStake}
              dark={true}
            />
          )}
        </div>
      ))}
      <WalletCardActions>
        <Link style={{ flex: 1 }} to={Routes.GOVERNANCE}>
          <button className="button-secondary">{t("governance")}</button>
        </Link>
        <Link style={{ flex: 1 }} to={Routes.STAKING}>
          <button className="button-secondary">{t("staking")}</button>
        </Link>
      </WalletCardActions>
      <VegaWalletAssetList accounts={accounts} />
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
      {footer}
    </>
  ) : (
    <WalletCardContent>{t("noKeys")}</WalletCardContent>
  );
};
