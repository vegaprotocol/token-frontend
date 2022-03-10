import { gql } from "@apollo/client";

export const PROPOSALS_FRAGMENT = gql`
  fragment ProposalFields on Proposal {
    id
    reference
    state
    datetime
    rejectionReason
    party {
      id
    }
    terms {
      closingDatetime
      enactmentDatetime
      change {
        ... on NewMarket {
          decimalPlaces
          metadata
          commitment {
            commitmentAmount
            fee
            sells {
              offset
              proportion
              reference
            }
            buys {
              offset
              proportion
              reference
            }
          }
          instrument {
            name
            code
            futureProduct {
              settlementAsset {
                name
                symbol
                id
              }
              quoteName
              oracleSpecBinding {
                settlementPriceProperty
                tradingTerminationProperty
              }
              oracleSpecForSettlementPrice {
                pubKeys
                filters {
                  key {
                    name
                    type
                  }
                  conditions {
                    value
                    operator
                  }
                }
              }
              oracleSpecForTradingTermination {
                pubKeys
                filters {
                  key {
                    name
                    type
                  }
                  conditions {
                    value
                    operator
                  }
                }
              }
            }
          }
        }
        ... on UpdateMarket {
          marketId
        }
        ... on NewAsset {
          __typename
          symbol
          source {
            ... on BuiltinAsset {
              maxFaucetAmountMint
            }
            ... on ERC20 {
              contractAddress
            }
          }
        }
        ... on UpdateNetworkParameter {
          networkParameter {
            key
            value
          }
        }
      }
    }
    votes {
      yes {
        totalTokens
        totalNumber
        votes {
          value
          party {
            id
            stake {
              currentStakeAvailable
            }
          }
          datetime
        }
      }
      no {
        totalTokens
        totalNumber
        votes {
          value
          party {
            id
            stake {
              currentStakeAvailable
            }
          }
          datetime
        }
      }
    }
  }
`;
