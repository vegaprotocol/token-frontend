import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  Reference,
  FieldFunctionOptions,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { addDecimal } from "./decimals";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import { deterministicShuffle } from "./deterministic-shuffle";
import { BigNumber } from "./bignumber";

// Create seed in memory. Validator list order will remain the same
// until the page is refreshed.
const VALIDATOR_RANDOMISER_SEED = (
  Math.floor(Math.random() * 1000) + 1
).toString();

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

  const formatUintToNumber = (amount: string, decimals = 18) =>
    addDecimal(new BigNumber(amount), decimals).toString();

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
      Query: {
        fields: {
          nodes: {
            // Merge function to make the validator list random but remain consistent
            // as the user navigates around the site. If the user refreshes the list
            // will be randomised.
            merge: (existing = [], incoming) => {
              // uniqBy will take the first of any matches
              const uniq = uniqBy([...incoming, ...existing], "id");
              // sort result so that the input is consistent
              const sorted = sortBy(uniq, "id");
              // randomise based on seed string
              const random = deterministicShuffle(
                VALIDATOR_RANDOMISER_SEED,
                sorted
              );
              return random;
            },
          },
        },
      },
      Account: {
        keyFields: false,
        fields: {
          balanceFormatted: {
            read(_: string, options: FieldFunctionOptions) {
              const balance = options.readField("balance");
              const asset = options.readField("asset");
              const decimals = options.readField(
                "decimals",
                asset as Reference
              );
              if (typeof balance !== "string") return "0";
              if (typeof decimals !== "number") return "0";
              return balance && decimals
                ? formatUintToNumber(balance, decimals)
                : "0";
            },
          },
        },
      },
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
      Reward: {
        keyFields: false,
        fields: {
          ...createReadField("amount"),
        },
      },
      RewardPerAssetDetail: {
        keyFields: false,
        fields: {
          ...createReadField("totalAmount"),
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
            merge(existing, incoming) {
              return {
                ...existing,
                ...incoming,
              };
            },
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

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log(graphQLErrors);
    console.log(networkError);
  });

  return new ApolloClient({
    connectToDevTools: process.env.NODE_ENV === "development",
    link: from([errorLink, retryLink, httpLink]),
    cache,
  });
}

export const client = createClient();
