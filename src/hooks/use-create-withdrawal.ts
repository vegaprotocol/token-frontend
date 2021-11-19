import React from "react";
import * as Sentry from "@sentry/react";
import {
  vegaWalletService,
  WithdrawSubmissionInput,
} from "../lib/vega-wallet/vega-wallet-service";
import { useApolloClient, gql } from "@apollo/client";
import { sigToId } from "../lib/sig-to-id";
import {
  WithdrawalPoll,
  WithdrawalPollVariables,
} from "./__generated__/WithdrawalPoll";

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

const WITHDRAWAL_QUERY = gql`
  query WithdrawalPoll($partyId: ID!) {
    party(partyId: $partyId) {
      id
      withdrawals {
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
`;

export function useCreateWithdrawal(pubKey: string): [Status, Submit] {
  const mountedRef = React.useRef(true);
  const client = useApolloClient();
  const [status, setStatus] = React.useState(Status.Idle);
  const [id, setId] = React.useState("");

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
    let interval: any = null;
    if (status === Status.Pending) {
      interval = setInterval(async () => {
        try {
          const { data } = await client.query<
            WithdrawalPoll,
            WithdrawalPollVariables
          >({
            query: WITHDRAWAL_QUERY,
            variables: { partyId: pubKey },
          });

          // find matching withdrawals
          const withdrawal = data?.party?.withdrawals?.find((e) => {
            return e.id === id;
          });
          if (withdrawal) {
            safeSetStatus(Status.Success);
            clearInterval(interval);
          }
        } catch (err) {
          debugger;
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [client, id, pubKey, status]);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return [status, submit];
}
