---
name: Bug report
about: Create a report to help us improve
title: "Bug:"
labels: "bug"
assignees: ""
---

# 🛑 STOP 🛑

Before you file this bug please ensure that this is a **front end** bug. Go through the following checklist:

1. Ropsten is functional, [click here](https://ropsten.etherscan.io/) and make sure the last block was less than 1 min ago otherwise it indicates Ropsten issues. Please retest when Ropsten is stable.
2. The network you are testing on is stable [click here](https://stats.vega.trading/) and make sure block times are less than 2 seconds and the status is connected. Please retest when stable in if not.
3. You have made your best effort at validating that the core data is correct and the behaviour is not intended in terms of the Vega Protocol or Smart Contracts. You can use the [devnet](https://n04.d.vega.xyz/playground), [stagnet](https://n03.s.vega.xyz/playground) and [testnet](https://n06.testnet.vega.xyz/playground) GraphQl playgrounds to do so for the core side. You can also use [Ropsten](https://ropsten.etherscan.io/) to check functions are returning different values to what you are seeing in smart contracts.
4. Make sure you have tried with the latest version of go-wallet

If you are certain everything is as it should be above then please complete the below:

# Bug report

## Describe the bug

A clear and concise description of what the bug is.

## Environement

What environement did this occur on?

## To Reproduce

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected behavior

A clear and concise description of what you expected to happen.

## Screenshots

If applicable, add screenshots to help explain your problem. The more the better 🙏.

## Your browser information:

Copy the link from [here](https://www.whatsmybrowser.org/) and paste it here:

## ETH Wallet software:

What ETH wallet software did you use? e.g. Metamask.

## Vega Wallet software version:

What version wallet software did you use? Run the following:

```
go-wallet version
```

## Run the following GQL query on the playground above (depending on the env you are using):

This **really** helps as it means in case of network resets we can still check your bug.

### Query:

```
query SuperQuery {
    party(id: "[YOUR VEGA WALLET KEY]") {
      id
    	rewardDetails {
        totalAmount
        rewards {
          amount
          assetId
          partyId
          percentageOfTotal
          epoch
        }
      }
    	delegations {
        epoch
        amount
        node {
          id
        }
        party {
          id
        }
      }
      stake {
        linkings {
          id
          amount
          status
          txHash
          timestamp
        }
        currentStakeAvailable
      }
    }
  epoch {
    id
    timestamps {
      expiry
      end
      start
    }
  }
  nodes {
      id
      pubkey
      infoUrl
      location
      stakedByOperator
      stakedByDelegates
      stakedTotal
      pendingStake
      epochData {
        total
        offline
        online
      }
      status
    }
}
```

### Result:

**Add the result here**

## Additional context

Add any other context about the problem here. Or just anything you think we should know.
