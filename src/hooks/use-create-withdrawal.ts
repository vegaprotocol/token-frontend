import React from "react";
import * as Sentry from "@sentry/react";
import {
  vegaWalletService,
  WithdrawSubmissionInput,
} from "../lib/vega-wallet/vega-wallet-service";
import { useApolloClient, gql } from "@apollo/client";
import { sigToId } from "../lib/sig-to-id";
import {
  WithdrawalEvents,
  WithdrawalEventsVariables,
} from "./__generated__/WithdrawalEvents";

export enum Status {
  Idle,
  Submitted,
  Pending,
  Success,
  Failure,
}

type Submit = (
  amount: string,
  asset: string,
  receiverAddress: string
) => Promise<void>;

const WITHDRAWAL_SUB = gql`
  subscription WithdrawalEvents($partyId: ID!) {
    busEvents(partyId: $partyId, batchSize: 0, types: [Withdrawal]) {
      eventId
      block
      type
      event {
        ... on Withdrawal {
          id
          amount
          status
          asset {
            id
            symbol
            decimals
          }
          party {
            id
          }
          createdTimestamp
          withdrawnTimestamp
          txHash
          details {
            ... on Erc20WithdrawalDetails {
              receiverAddress
            }
          }
        }
      }
    }
  }
`;

export function useCreateWithdrawal(pubKey: string): [Status, Submit] {
  const mountedRef = React.useRef(true);
  const subRef = React.useRef<ZenObservable.Subscription | null>(null);
  const client = useApolloClient();
  const [status, setStatus] = React.useState(Status.Idle);
  const [id, setId] = React.useState("");

  const safeSetStatus = (status: Status) => {
    if (mountedRef.current) {
      setStatus(status);
    }
  };

  const stopSub = () => {
    if (subRef.current) {
      subRef.current.unsubscribe();
    }
  };

  const submit = React.useCallback(
    async (amount: string, asset: string, receiverAddress: string) => {
      const command: WithdrawSubmissionInput = {
        pubKey,
        withdrawSubmission: {
          amount,
          asset,
          ext: {
            erc20: {
              receiverAddress,
            },
          },
        },
      };

      safeSetStatus(Status.Submitted);

      try {
        const [err, res] = await vegaWalletService.commandSync(command);

        if (err || !res) {
          safeSetStatus(Status.Failure);
        } else {
          const id = sigToId(res.signature.value);
          setId(id);
          // Now await subscription
        }

        safeSetStatus(Status.Pending);
      } catch (err) {
        safeSetStatus(Status.Failure);
        Sentry.captureException(err);
      }
    },
    [pubKey]
  );

  React.useEffect(() => {
    if (status === Status.Pending) {
      // start bus event sub
      subRef.current = client
        .subscribe<WithdrawalEvents, WithdrawalEventsVariables>({
          query: WITHDRAWAL_SUB,
          variables: { partyId: pubKey },
        })
        .subscribe(({ data }) => {
          if (!data?.busEvents?.length) return;

          // find matching withdrawals
          const withdrawal = data.busEvents.find((e) => {
            if (e.event.__typename !== "Withdrawal") return false;
            if (e.event.id === id) return true;
            return false;
          });

          if (withdrawal) {
            safeSetStatus(Status.Success);
            stopSub();
          }
        });
    }

    if (status === Status.Success || status === Status.Failure) {
      stopSub();
    }

    return () => {
      stopSub();
    };
  }, [status, client, pubKey, id]);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return [status, submit];
}
