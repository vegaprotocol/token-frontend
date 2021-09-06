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
import { proposalTypePolicy } from "./type-policies/proposal";

export function createClient() {
  const base = process.env.REACT_APP_VEGA_URL || "https://n04.d.vega.xyz/query";
  const gqlPath = "query";
  const urlHTTP = new URL(gqlPath, base);
  const urlWS = new URL(gqlPath, base);
  // Replace http with ws, preserving if its a secure connection eg. https => wss
  urlWS.protocol = urlWS.protocol.replace("http", "ws");

  const cache = new InMemoryCache({
    typePolicies: {
      ...proposalTypePolicy,
      Node: {
        keyFields: false,
      },
      NodeData: {
        merge: (existing = {}, incoming) => {
          return { ...existing, ...incoming };
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
