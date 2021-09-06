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
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { VegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import { useVegaStaking } from "../../hooks/use-vega-staking";
import { BigNumber } from "../../lib/bignumber";
import { gql, useApolloClient } from "@apollo/client";
import {
  Delegations,
  DelegationsVariables,
  Delegations_party_delegations,
} from "./__generated__/Delegations";
import { useVegaUser } from "../../hooks/use-vega-user";
import { useVegaVesting } from "../../hooks/use-vega-vesting";

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
    appState: {
      ethAddress: address,
      walletAssociatedBalance,
      vestingAssociatedBalance,
    },
  } = useAppState();

  const [disconnecting, setDisconnecting] = React.useState(false);
  const staking = useVegaStaking();
  const vesting = useVegaVesting();
  const [expanded, setExpanded] = React.useState(false);
  const client = useApolloClient();
  const [delegations, setDelegations] = React.useState<
    Delegations_party_delegations[]
  >([]);

  React.useEffect(() => {
    let interval: any;
    if (currVegaKey?.pub) {
      // start polling for delegation
      interval = setInterval(() => {
        client
          .query<Delegations, DelegationsVariables>({
            query: DELEGATIONS_QUERY,
            variables: { partyId: currVegaKey.pub },
          })
          .then((res) => {
            const filter =
              res.data.party?.delegations?.filter((d) => {
                return d.epoch.toString() === res.data.epoch.id;
              }) || [];
            setDelegations(filter);
          })
          .catch((err: Error) => {
            // If query fails stop interval. Its almost certain that the query
            // will just continue to fail
            clearInterval(interval);
          });
      }, 1000);
    }

    return () => clearInterval(interval);
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

  const changeKey = React.useCallback(
    async (k: VegaKeyExtended) => {
      let walletAssociatedBalance = null;
      let vestingAssociatedBalance = null;
      if (address) {
        walletAssociatedBalance = await staking.stakeBalance(address, k.pub);
        vestingAssociatedBalance = await vesting.stakeBalance(address, k.pub);
      }
      appDispatch({
        type: AppStateActionType.VEGA_WALLET_SET_KEY,
        key: k,
        walletAssociatedBalance: walletAssociatedBalance,
        vestingAssociatedBalance,
      });
      setExpanded(false);
    },
    [address, appDispatch, staking, vesting]
  );

  return vegaKeys.length ? (
    <>
      {walletAssociatedBalance ? (
        <WalletCardRow
          label={t("Wallet associated")}
          value={walletAssociatedBalance}
          valueSuffix={t("VEGA")}
        />
      ) : null}
      {vestingAssociatedBalance ? (
        <WalletCardRow
          label={t("Vesting associated")}
          value={vestingAssociatedBalance}
          valueSuffix={t("VEGA")}
        />
      ) : null}
      {delegations.map((d) => (
        <WalletCardRow
          label={d.node.id}
          value={d.amount}
          valueSuffix={t("VEGA")}
        />
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
      <div className="vega-wallet__actions">
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
      </div>
    </>
  ) : (
    <WalletCardContent>{t("noKeys")}</WalletCardContent>
  );
};
