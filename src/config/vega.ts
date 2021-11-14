export enum Networks {
  CUSTOM = "CUSTOM",
  TESTNET = "TESTNET",
  STAGNET = "STAGNET",
  DEVNET = "DEVNET",
  MAINNET = "MAINNET",
}

interface VegaNode {
  url: string;
  api: {
    GraphQL: boolean;
  };
}

type VegaNets = {
  [N in Networks]: {
    nodes: VegaNode[];
  };
};

export type NetworkConfig = {
  [N in Networks]: string[];
};

const splitFilter = (a: string) => a.split(',').filter(a => a.length > 0);
const getCustomNodesFromOptionalEnvironmentVariables = () => {
  const validatorUrls = process.env.CUSTOM_URLS || ""
  const validatorUrlsWithGraphQL = process.env.CUSTOM_URLS_WITH_GRAPHQL || ""

  const validatorUrlsList: string[] = splitFilter(validatorUrls);
  const validatorUrlsWithGraphQLList: string[] = splitFilter(validatorUrlsWithGraphQL);

  const customNodes: VegaNode[] = validatorUrlsList.map(a => ({url: a, api: {GraphQL: false}}))
    .concat(validatorUrlsWithGraphQLList.map(a => ({url: a, api: {GraphQL: true}})));

  if(customNodes.length === 0) {
    throw new Error("Environment variable CUSTOM requires at least one Data Node URL to be set for enivronment variables CUSTOM_URLS and/or CUSTOM_URLS_WITH_GRAPHQL");
  }

  return customNodes;
}

export const VegaNetworks: VegaNets = {
  [Networks.DEVNET]: {
    nodes: [
      {
        url: "https://n01.d.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n02.d.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n03.d.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n04.d.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
    ],
  },
  [Networks.STAGNET]: {
    nodes: [
      {
        url: "https://n01.s.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n02.s.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n03.s.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
      {
        url: "https://n04.s.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n05.s.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
    ],
  },
  [Networks.TESTNET]: {
    nodes: [
      {
        url: "https://lb.testnet.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
      {
        url: "https://n01.testnet.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n02.testnet.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n03.testnet.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n04.testnet.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n05.testnet.vega.xyz",
        api: {
          GraphQL: false,
        },
      },
      {
        url: "https://n06.testnet.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
      {
        url: "https://n07.testnet.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
      {
        url: "https://n08.testnet.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
      {
        url: "https://n09.testnet.vega.xyz",
        api: {
          GraphQL: true,
        },
      },
    ],
  },
  [Networks.CUSTOM]: {
    nodes: getCustomNodesFromOptionalEnvironmentVariables(),
  },
  [Networks.MAINNET]: {
    nodes: [],
  },
};

export const GraphQLNodes = Object.keys(VegaNetworks).reduce(
  (obj: Record<string, string[]>, network) => {
    // @ts-ignore
    const rawNodes: VegaNode[] = VegaNetworks[network].nodes;
    const nodesWithGraphQL = rawNodes
      .filter((n) => n.api.GraphQL)
      .map((n) => n.url);
    obj[network] = nodesWithGraphQL;
    return obj;
  },
  {}
) as NetworkConfig;

