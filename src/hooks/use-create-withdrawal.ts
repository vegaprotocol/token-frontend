import React from "react";
import * as Sentry from "@sentry/react";
import {
  vegaWalletService,
  WithdrawSubmissionInput,
} from "../lib/vega-wallet/vega-wallet-service";
import { useApolloClient, gql } from "@apollo/client";

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
  subscription withdrawalEvents($partyId: ID!) {
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

  // TODO: validate submission input
  const validate = (command: WithdrawSubmissionInput) => {
    return true;
  };

  const safeSetStatus = (status: Status) => {
    if (mountedRef.current) {
      setStatus(status);
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

      const valid = validate(command);

      if (!valid) {
        safeSetStatus(Status.Failure);
        return;
      }

      safeSetStatus(Status.Submitted);

      try {
        const [err] = await vegaWalletService.commandSync(command);

        if (err) {
          safeSetStatus(Status.Failure);
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
        .subscribe({
          query: WITHDRAWAL_SUB,
          variables: { partyId: pubKey },
        })
        .subscribe(({ data }) => {
          console.log(data);
          // find matching withdrawal
        });
    }

    if (status === Status.Success || status === Status.Failure) {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
    }

    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
    };
  }, [status, client, pubKey]);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return [status, submit];
}
