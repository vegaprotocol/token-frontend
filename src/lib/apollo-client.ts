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

  const cache = new InMemoryCache({
    typePolicies: {
      Node: {
        keyFields: false,
      },
      NodeData: {
        merge: (existing = {}, incoming) => {
          return { ...existing, ...incoming };
        },
      },
      Party: {
        fields: {
          stake: {
            read(data) {
              if (data) {
                return {
                  ...data,
                  formattedCurrentStakeAvailable: addDecimal(
                    new BigNumber(data.currentStakeAvailable),
                    18
                  ).toString(),
                };
              }
              return data;
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
