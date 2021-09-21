import type { Operation } from "@apollo/client";
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import BigNumber from "bignumber.js";
import { Delegations_party_delegations } from "../components/vega-wallet/__generated__/Delegations";
import { Parties_parties_stake } from "../routes/governance/__generated__/Parties";
import { addDecimal } from "./decimals";

export function createClient() {
  const base = process.env.REACT_APP_VEGA_URL;
  if (!base) {
    throw new Error("Environment variable REACT_APP_VEGA_URL must be set");
  }
  const gqlPath = "query";
  const urlHTTP = new URL(gqlPath, base);
  const urlWS = new URL(gqlPath, base);
  // Replace http with ws, preserving if its a secure connection eg. https => wss
  urlWS.protocol = urlWS.protocol.replace("http", "ws");

  const formatUintToNumber = (amount: string) =>
    addDecimal(new BigNumber(amount), 18).toString();

  const cache = new InMemoryCache({
    typePolicies: {
      Delegation: {
        keyFields: false,
        fields: {
          amount: {
            read(amount) {
              return amount ? formatUintToNumber(amount) : "0";
            },
          },
        },
      },
      Node: {
        keyFields: false,
        fields: {
          stakedTotal: {
            read(stakedTotal) {
              return stakedTotal ? formatUintToNumber(stakedTotal) : "0";
            },
          },
        },
      },
      NodeData: {
        merge: (existing = {}, incoming) => {
          return { ...existing, ...incoming };
        },
        fields: {
          stakedTotal: {
            read(stakedTotal) {
              return stakedTotal ? formatUintToNumber(stakedTotal) : "0";
            },
          },
        },
      },
      Party: {
        fields: {
          delegations: {
            read(
              delegations:
                | Delegations_party_delegations
                | Delegations_party_delegations[]
                | null
            ) {
              if (delegations) {
                if (!Array.isArray(delegations)) {
                  delegations = [delegations];
                }
                const mappedDelegations = delegations.map((d) => ({
                  ...d,
                  formattedAmount: formatUintToNumber(d.amount),
                }));
                return mappedDelegations;
              }
              return delegations;
            },
          },
          stake: {
            read(stake: Parties_parties_stake) {
              if (stake) {
                return {
                  ...stake,
                  formattedCurrentStakeAvailable: formatUintToNumber(
                    stake.currentStakeAvailable
                  ),
                };
              }
              return stake;
            },
          },
        },
      },
    },
  });

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true,
    },
  });

  const httpLink = new HttpLink({
    uri: urlHTTP.href,
    credentials: "same-origin",
  });

  const wsLink = new WebSocketLink({
    uri: urlWS.href,
    options: {
      reconnect: true,
    },
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log(graphQLErrors);
    console.log(networkError);
  });

  const link = split(
    // split based on operation type
    ({ query }: Operation) => {
      const def = getMainDefinition(query);
      if (
        def.kind === "OperationDefinition" &&
        def.operation === "subscription"
      ) {
        // If it is a subscription, return true to send this to websocket
        return true;
      }
      // Default for mutations and queries not specified above: use HTTP(s)
      return false;
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    connectToDevTools: process.env.NODE_ENV === "development",
    link: from([errorLink, retryLink, link]),
    cache,
  });
}

export const client = createClient();
