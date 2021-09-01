# Token frontend

***Control panel for your VEGA tokens***

Insert Screenshot

## Features
- View vesting progress
- Redeem VEGA tokens
- Stake VEGA tokens

# Development

Install:
`yarn`

Add .env file in root:

```bash
// .env
REACT_APP_CHAIN=0x3
```

Starting the app:
`yarn start`

## Configuration

There are a few different configuration options offered for this app:

| **Flag**  | **Purpose**  |
| ------------ | ------------ |
|  `REACT_APP_SENTRY_DSN` |  The sentry endpoint   to report to. Should be off in dev but set in live. |
|  `REACT_APP_REDEEM_LIVE`  | Disables call-to-actions about redeeming tokens while this feature is in development  |
|  `REACT_APP_CHAIN`  | The ETH chain for the app to work on. Should be mainnet for live, but ropsten for preview deploys. |

## Example configs:
The used config can be found in [netlify.toml](./netlify.toml).

```
REACT_APP_CHAIN=0x3
```

Example config file for testnet:

```
REACT_APP_SENTRY_DSN=https://4b8c8a8ba07742648aa4dfe1b8d17e40@o286262.ingest.sentry.io/5882996
REACT_APP_CHAIN=0x3
```

Example config for live:

```
REACT_APP_SENTRY_DSN=https://4b8c8a8ba07742648aa4dfe1b8d17e40@o286262.ingest.sentry.io/5882996
REACT_APP_CHAIN=0x1
```

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
- [vega-locked-erc20](https://github.com/vegaprotocol/vega-locked-erc20) - a proxy contract that shows your current balance
  of locked tokens.
- [VEGA Tokens: Vesting Details](https://blog.vega.xyz/vega-tokens-vesting-details-890b00fc238e) - a blog describing
  the vesting process & key dates.
- [Introducing the VEGA token](https://blog.vega.xyz/introducing-the-vega-token-40dac090b5c1) - a blog about the VEGA
  token.
- [vega.xyz](https://vega.xyz) - about Vega Protocol

# License
[MIT](LICENSE)
