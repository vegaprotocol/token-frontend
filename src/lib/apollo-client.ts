import { FieldFunctionOptions, Operation } from "@apollo/client";
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

  const formatUintToNumber = (amount: string) =>
    addDecimal(new BigNumber(amount), 18).toString();

  const createReadField = (fieldName: string) => ({
    [`${fieldName}Formatted`]: {
      read(_: string, options: FieldFunctionOptions) {
        const amount = options.readField(fieldName) as string;
        return amount ? formatUintToNumber(amount) : "0";
      },
    },
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Delegation: {
        keyFields: false,
        // Only get full updates
        merge(_, incoming: any[]) {
          return incoming;
        },
        fields: {
          ...createReadField("amount"),
        },
      },
      Node: {
        keyFields: false,
        fields: {
          ...createReadField("pendingStake"),
          ...createReadField("stakedByOperator"),
          ...createReadField("stakedByDelegates"),
          ...createReadField("stakedTotal"),
        },
      },
      NodeData: {
        merge: (existing = {}, incoming) => {
          return { ...existing, ...incoming };
        },
        fields: {
          ...createReadField("stakedTotal"),
        },
      },
      Party: {
        fields: {
          stake: {
            read(stake) {
              if (stake) {
                return {
                  ...stake,
                  currentStakeAvailableFormatted: formatUintToNumber(
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
