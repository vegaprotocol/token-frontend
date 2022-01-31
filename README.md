# The Vega token website

**_Control panel for your VEGA tokens_**

<img width="1438" alt="Screenshot 2021-12-11 at 06 32 51" src="https://user-images.githubusercontent.com/13255539/145666935-563fc1ff-35bc-4cd9-ae6d-cf711cc23454.png">

## Features

- View vesting progress
- Redeem VEGA tokens
- Stake VEGA tokens
- Withdraw tokens
- Vote on proposals

# Development

Install:
`yarn install`

Starting the app:
`yarn start`

## Configuration

There are a few different configuration options offered for this app:

| **Flag**                             | **Purpose**                                                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `REACT_APP_SENTRY_DSN`               | The sentry endpoint to report to. Should be off in dev but set in live.                                  |
| `REACT_APP_CHAIN`                    | The ETH chain for the app to work on. Should be mainnet for live, but ropsten for preview deploys.       |
| `REACT_APP_VEGA_URL`                 | The GraphQL query endpoint of a [Vega data node](https://github.com/vegaprotocol/networks#data-node)     |
| `REACT_APP_DEX_STAKING_DISABLED`     | Disable the dex liquidity page an show a coming soon message                                             |
| `REACT_APP_FAIRGROUND`               | Change styling to be themed as the fairground version of the website                                     |
| `REACT_APP_INFURA_ID`                | Infura fallback for if the user does not have a web3 compatible browser                                  |
| `REACT_APP_SUPPORTED_WALLET_VERSION` | The minimum wallet semver version supported by this application otherwise an error message will be shown |
| `REACT_APP_HOSTED_WALLET_ENABLED`    | If the hosted wallet is enabled or not. If so then allow users to login using the hosted wallet          |
| `REACT_APP_ENV`                      | Change network to connect to. When set to CUSTOM use CUSTOM\_\* vars for network parameters              |
| `CUSTOM_URLS`                        | When REACT_APP_ENV=CUSTOM use these Data Node REST URLs, optional if CUSTOM_URLS_WITH_GRAPHQL is used.   |
| `CUSTOM_URLS_WITH_GRAPHQL`           | When REACT_APP_ENV=CUSTOM use these Data Node GraphQL URLs, optional if CUSTOM_URLS is used.             |
| `CUSTOM_TOKEN_ADDRESS`               | When REACT_APP_ENV=CUSTOM specify Vega token address.                                                    |
| `CUSTOM_CLAIM_ADDRESS`               | When REACT_APP_ENV=CUSTOM specify Vega claim address.                                                    |
| `CUSTOM_LOCKED_ADDRESS`              | When REACT_APP_ENV=CUSTOM specify Vega locked address.                                                   |
| `CUSTOM_VESTING_ADDRESS`             | When REACT_APP_ENV=CUSTOM specify Vega vesting address.                                                  |
| `CUSTOM_STAKING_BRIDGE`              | When REACT_APP_ENV=CUSTOM specify Vega staking bridge address.                                           |

## Example configs:

For example configurations, check out our [netlify.toml](./netlify.toml).

## Testing

To run the minimal set of unit tests, run the following:

```bash
yarn install
yarn test
```

To run the UI automation tests with a mocked API, run:

```bash
yarn install
yarn add cypress
yarn start:mock &
cd automation
yarn
yarn cypress:open
```

## See also

- [vega-locked-erc20](https://github.com/vegaprotocol/vega-locked-erc20) - proxy contract that shows your current balance
  of locked tokens
- [VEGA Tokens: Vesting Details](https://blog.vega.xyz/vega-tokens-vesting-details-890b00fc238e) - blog describing
  the vesting process & key dates
- [Introducing the VEGA token](https://blog.vega.xyz/introducing-the-vega-token-40dac090b5c1) - blog about the VEGA
  token
- [The VEGA Token Listing & LP Incentives](https://blog.vega.xyz/unlocking-vega-coinlist-pro-uniswap-sushiswap-b1414750e358) - blog about the token and site
- [vega.xyz](https://vega.xyz) - about Vega Protocol

# License

[MIT](LICENSE)
