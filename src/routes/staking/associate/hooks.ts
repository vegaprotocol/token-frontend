import React from "react";
import * as Sentry from "@sentry/react";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { TxState } from "../../../hooks/transaction-reducer";
import { StakingMethod } from "../../../components/staking-method-radio";
import { useRefreshBalances } from "../../../hooks/use-refresh-balances";
import { useApolloClient, gql } from "@apollo/client";
import { StakeLinkingStatus } from "../../../__generated__/globalTypes";
import {
  PartyStakeLinkings,
  PartyStakeLinkingsVariables,
  PartyStakeLinkings_party_stake_linkings,
} from "./__generated__/PartyStakeLinkings";
import { useContracts } from "../../../contexts/contracts/contracts-context";

export const useAddStake = (
  address: string,
  amount: string,
  vegaKey: string,
  stakingMethod: StakingMethod | "",
  confirmations: number
) => {
  const vesting = useVegaVesting();
  const { staking } = useContracts();
  const contractAdd = useTransaction(
    () => vesting.addStake(address!, amount, vegaKey),
    () => vesting.checkAddStake(address!, amount, vegaKey),
    confirmations
  );
  const walletAdd = useTransaction(
    () => staking.addStake(address!, amount, vegaKey),
    () => staking.checkAddStake(address!, amount, vegaKey),
    confirmations
  );
  const refreshBalances = useRefreshBalances(address);

  React.useEffect(() => {
    if (
      walletAdd.state.txState === TxState.Complete ||
      contractAdd.state.txState === TxState.Complete
    ) {
      refreshBalances();
    }
  }, [contractAdd.state.txState, refreshBalances, walletAdd.state.txState]);

  return React.useMemo(() => {
    if (stakingMethod === StakingMethod.Contract) {
      return contractAdd;
    } else {
      return walletAdd;
    }
  }, [contractAdd, stakingMethod, walletAdd]);
};

const PARTY_STAKE_LINKINGS = gql`
  query PartyStakeLinkings($partyId: ID!) {
    party(id: $partyId) {
      stake {
        linkings {
          id
          txHash
          status
        }
      }
    }
  }
`;

export const usePollForStakeLinking = (
  partyId: string,
  txHash: string | null
) => {
  const client = useApolloClient();
  const [linking, setLinking] =
    React.useState<PartyStakeLinkings_party_stake_linkings | null>(null);

  // Query for linkings under current connected party (vega key)
  React.useEffect(() => {
    let interval: any;

    interval = setInterval(() => {
      if (!txHash || !partyId) return;

      client
        .query<PartyStakeLinkings, PartyStakeLinkingsVariables>({
          query: PARTY_STAKE_LINKINGS,
          variables: { partyId },
          // 'network-only' doesn't work here. Pretty wierd. no-cache just means its network only plus
          // the result is not stored in the cache
          fetchPolicy: "no-cache",
        })
        .then((res) => {
          const linkings = res.data?.party?.stake.linkings;

          if (!linkings?.length) return;

          const matchingLinking = linkings?.find((l) => {
            return (
              l.txHash === txHash && l.status === StakeLinkingStatus.Accepted
            );
          });

          if (matchingLinking) {
            setLinking(matchingLinking);
            clearInterval(interval);
          }
        })
        .catch((err) => {
          Sentry.captureException(err);
          clearInterval(interval);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [partyId, client, txHash]);

  return linking;
};
