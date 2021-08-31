[![Netlify Status](https://api.netlify.com/api/v1/badges/0c312b37-db30-47ed-b7fd-bda5304f5d77/deploy-status)](https://app.netlify.com/sites/token-vega-xyz/deploys)

# Setup

Install:
`yarn`

Add .env file in root:

```bash
// .env
REACT_APP_CHAIN=0x3
REACT_APP_SHOW_NETWORK_SWITCHER=1
```

Starting the app:
`yarn start`

# Configuration

There are a few different configuration options offered for this app:

## REACT_APP_SENTRY_DSN

The sentry DNS to report to. Should be off in dev but set in live

## REACT_APP_CHAIN

The desired chain for the app to work on. Should be mainnet for live, but ropsten for preview deploys.

## REACT_APP_SHOW_NETWORK_SWITCHER

Allows you to change the above dynamically in the application. Useful for testing, should be on for preview deploys/dev but should be for live.

## Example configs:

The used config can be found in [netlify.toml](./netlify.toml).

```
REACT_APP_CHAIN=0x3
REACT_APP_SHOW_NETWORK_SWITCHER=1
```

Example config file for testnet:

```
REACT_APP_SENTRY_DSN=https://4b8c8a8ba07742648aa4dfe1b8d17e40@o286262.ingest.sentry.io/5882996
REACT_APP_CHAIN=0x3
REACT_APP_SHOW_NETWORK_SWITCHER=1
```

Example config for live:

```
REACT_APP_SENTRY_DSN=https://4b8c8a8ba07742648aa4dfe1b8d17e40@o286262.ingest.sentry.io/5882996
REACT_APP_CHAIN=0x1
REACT_APP_SHOW_NETWORK_SWITCHER=0
```

## Cypress Automation

1. Install Cypress: `yarn add cypress`
2. Run `yarn start:mock` from the root level of the Token FE project
3. cd into automation
4. from automation, run `yarn`
5. from automation, run `yarn cypress:open`
