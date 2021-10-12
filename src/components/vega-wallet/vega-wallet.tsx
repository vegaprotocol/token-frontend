import React from "react";
import * as Sentry from "@sentry/react";
import "./vega-wallet.scss";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
  VegaWalletStatus,
} from "../../contexts/app-state/app-state-context";
import {
  WalletCard,
  WalletCardActions,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { VegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import { gql, useApolloClient } from "@apollo/client";
import {
  Delegations,
  DelegationsVariables,
  Delegations_party_delegations,
} from "./__generated__/Delegations";
import { useVegaUser } from "../../hooks/use-vega-user";
import { BigNumber } from "../../lib/bignumber";
import { truncateMiddle } from "../../lib/truncate-middle";
import { keyBy, uniq } from "lodash";
import { useContracts } from "../../contexts/contracts/contracts-context";

const DELEGATIONS_QUERY = gql`
  query Delegations($partyId: ID!) {
    epoch {
      id
    }
    party(id: $partyId) {
      delegations {
        amount
        node {
          id
        }
        epoch
      }
      stake {
        currentStakeAvailable
      }
    }
  }
`;

export const VegaWallet = () => {
  const { t } = useTranslation();
  const vegaWallet = useVegaWallet();
  const { currVegaKey, vegaKeys } = useVegaUser();

  const child = !vegaKeys ? (
    <VegaWalletNotConnected />
  ) : (
    <VegaWalletConnected
      vegaWallet={vegaWallet}
      currVegaKey={currVegaKey}
      vegaKeys={vegaKeys}
    />
  );

  return (
    <WalletCard>
      <WalletCardHeader>
        <span>
          {t("vegaKey")} {currVegaKey && `(${currVegaKey.alias})`}
        </span>
        {currVegaKey && (
          <>
            <span className="vega-wallet__curr-key">
              {currVegaKey.pubShort}
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
      {t("Connect")}
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
    appState: { ethAddress: address },
  } = useAppState();

  const [disconnecting, setDisconnecting] = React.useState(false);
  const { staking, vesting } = useContracts();
  const [expanded, setExpanded] = React.useState(false);
  const client = useApolloClient();
  const [delegations, setDelegations] = React.useState<
    Delegations_party_delegations[]
  >([]);
  const [delegatedNodes, setDelegatedNodes] = React.useState<
    {
      nodeId: string;
      hasStakePending: boolean;
      currentEpochStake?: BigNumber;
      nextEpochStake?: BigNumber;
    }[]
  >([]);
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
              return new BigNumber(b.amount).minus(a.amount).toNumber();
            });
            setDelegations(sortedDelegations);
            setCurrentStakeAvailable(
              new BigNumber(res.data.party?.stake.currentStakeAvailable || 0)
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
                hasStakePending: !!(
                  delegatedThisEpoch[d]?.amount &&
                  delegatedNextEpoch[d]?.amount &&
                  delegatedThisEpoch[d]?.amount !==
                    delegatedNextEpoch[d]?.amount
                ),
                currentEpochStake:
                  delegatedThisEpoch[d] &&
                  new BigNumber(delegatedThisEpoch[d].amount),
                nextEpochStake:
                  delegatedNextEpoch[d] &&
                  new BigNumber(delegatedNextEpoch[d].amount),
              }))
              .sort((a, b) => {
                if (a.currentEpochStake.isLessThan(b.currentEpochStake))
                  return 1;
                if (a.currentEpochStake.isGreaterThan(b.currentEpochStake))
                  return -1;
                if (a.nodeId < b.nodeId) return 1;
                if (a.nodeId > b.nodeId) return -1;
                return 0;
              });

            setDelegatedNodes(delegatedAmounts);
          })
          .catch((err: Error) => {
            console.log(err);
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
  }, [client, currVegaKey?.pub]);

  const handleDisconnect = React.useCallback(
    async function () {
      try {
        setDisconnecting(true);
        await vegaWallet.revokeToken();
        appDispatch({ type: AppStateActionType.VEGA_WALLET_DISCONNECT });
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    [appDispatch, vegaWallet]
  );

  const unstaked = React.useMemo(() => {
    const totalDelegated = delegations.reduce<BigNumber>(
      (acc, cur) => acc.plus(cur.amount),
      new BigNumber(0)
    );
    return currentStakeAvailable.minus(totalDelegated);
  }, [currentStakeAvailable, delegations]);

  const changeKey = React.useCallback(
    async (k: VegaKeyExtended) => {
      let walletAssociatedBalance: BigNumber | null = null;
      let vestingAssociatedBalance: BigNumber | null = null;
      if (address) {
        walletAssociatedBalance = await staking.stakeBalance(address, k.pub);
        vestingAssociatedBalance = await vesting.stakeBalance(address, k.pub);
      }
      appDispatch({
        type: AppStateActionType.VEGA_WALLET_SET_KEY,
        key: k,
        walletAssociatedBalance,
        vestingAssociatedBalance,
      });
      setExpanded(false);
    },
    [address, appDispatch, staking, vesting]
  );

  return vegaKeys.length ? (
    <>
      <WalletCardRow
        label={t("associatedVega")}
        value={currentStakeAvailable}
        valueSuffix={t("VEGA")}
      />
      <WalletCardRow
        label={t("unstaked")}
        value={unstaked}
        valueSuffix={t("VEGA")}
      />
      {delegatedNodes.map((d) => (
        <div key={d.nodeId}>
          {d.currentEpochStake && (
            <WalletCardRow
              label={`${truncateMiddle(d.nodeId)} ${
                d.hasStakePending ? "(This epoch)" : ""
              }`}
              value={d.currentEpochStake}
              valueSuffix={t("VEGA")}
            />
          )}
          {d.hasStakePending && (
            <WalletCardRow
              label={`${truncateMiddle(d.nodeId)} (Next epoch)`}
              value={d.nextEpochStake}
              valueSuffix={t("VEGA")}
            />
          )}
        </div>
      ))}
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
      <WalletCardActions>
        {vegaKeys.length > 1 ? (
          <button
            className="button-link button-link--dark"
            onClick={() => setExpanded((x) => !x)}
            type="button"
          >
            {expanded ? "Hide keys" : "Change key"}
          </button>
        ) : null}
        <button
          className="button-link button-link--dark"
          onClick={handleDisconnect}
          type="button"
        >
          {disconnecting ? t("awaitingDisconnect") : t("disconnect")}
        </button>
      </WalletCardActions>
    </>
  ) : (
    <WalletCardContent>{t("noKeys")}</WalletCardContent>
  );
};
