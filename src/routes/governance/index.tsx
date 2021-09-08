import React from "react";
import compact from "lodash/compact";
import flow from "lodash/flow";
import orderBy from "lodash/orderBy";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { gql, useQuery } from "@apollo/client";
import { Proposals } from "./__generated__/proposals";
import { Callout } from "../../components/callout";
import { ProposalsList } from "./proposals-list";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { AssociateContainer } from "../staking/associate/associate-page";
import { DisassociateContainer } from "../staking/disassociate/disassociate-page";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { Proposal } from "./proposal";

// # fragment ProposalFields on Proposals {

export const PROPOSALS_QUERY = gql`
  query Proposals {
    proposals {
      id
      name @client
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
            instrument {
              name
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
          totalWeight
          totalNumber
          votes {
            value
            party {
              id
            }
            datetime
          }
        }
        no {
          totalTokens
          totalWeight
          totalNumber
          votes {
            value
            party {
              id
            }
            datetime
          }
        }
      }
      pending @client
    }
  }
`;

export const proposalsSubscription = gql`
  subscription proposalsSub {
    # ...ProposalFields
    proposals {
      id
      name @client
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
            instrument {
              name
            }
          }
          ... on UpdateMarket {
            marketId
          }
          ... on UpdateNetworkParameter {
            __typename
            networkParameter {
              key
              value
            }
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
        }
      }
      votes {
        yes {
          totalTokens
          totalWeight
          totalNumber
          votes {
            value
            party {
              id
            }
            datetime
          }
        }
        no {
          totalTokens
          totalWeight
          totalNumber
          votes {
            value
            party {
              id
            }
            datetime
          }
        }
      }
      pending @client
    }
  }
`;

const GovernanceRouter = ({ name }: RouteChildProps) => {
  const match = useRouteMatch();
  useDocumentTitle(name);
  const { data, loading, error, subscribeToMore } = useQuery<Proposals, never>(
    PROPOSALS_QUERY,
    {
      errorPolicy: "ignore",
    }
  );

  React.useEffect(() => {
    const unsub = subscribeToMore({
      document: proposalsSubscription,
      // @ts-ignore
      updateQuery: (prev, data) => updateProposals(prev, data, notify),
    });

    return () => {
      unsub();
    };
  }, [subscribeToMore]);

  // const proposals = React.useMemo(() => {
  //   if (!data?.proposals?.length) {
  //     return [];
  //   }

  //   return flow([
  //     compact,
  //     (arr) =>
  //       orderBy(
  //         arr,
  //         [
  //           (p) => new Date(p.terms.closingDatetime),
  //           (p) => new Date(p.terms.enactmentDatetime),
  //         ],
  //         ["asc", "asc"]
  //       ),
  //   ])(data.proposals);
  // }, [data]);

  const proposals = React.useMemo(() => {
    const tempData = {
      proposals: [
        {
          id: "dab4eb13c027c82f1f2c9208aa4fe7c04413f91e5709fa4a44a4c29f4d449266",
          reference: "",
          state: "Open",
          datetime: "2021-09-02T13:19:42.157201307Z",
          rejectionReason: null,
          party: {
            id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2022-03-01T00:00:00Z",
            enactmentDatetime: "2022-08-30T23:00:00Z",
            change: {
              networkParameter: {
                key: "market.fee.factors.makerFee",
                value: "0.0003",
                __typename: "NetworkParameter",
              },
              __typename: "UpdateNetworkParameter",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "0",
              totalWeight: "0",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
                    __typename: "Party",
                  },
                  datetime: "2021-09-02T13:20:23.184093701Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "0",
              totalWeight: "0",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "a7151308a923a5c2cd132eed0e1e1335f8bcf4c3f79d15b541a3603d603aeeda",
          reference: "1lXgFJxjX2SVviyEyVVlLJrqqpTlyoyeUKxy9XdC",
          state: "Enacted",
          datetime: "2021-08-16T21:30:02.966547129Z",
          rejectionReason: null,
          party: {
            id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2021-08-16T21:31:21Z",
            enactmentDatetime: "2021-08-16T21:33:31Z",
            change: {
              decimalPlaces: 5,
              metadata: [
                "formerly:076BB86A5AA41E3E",
                "base:BTC",
                "quote:USD",
                "class:fx/crypto",
                "monthly",
                "sector:crypto",
              ],
              instrument: {
                name: "BTCUSD Monthly (31 Dec 2021)",
                code: "BTCUSD.MF21",
                futureProduct: {
                  maturity: "2021-12-31T23:59:59Z",
                  settlementAsset: {
                    id: "6d9d35f657589e40ddfb448b7ad4a7463b66efb307527fedd2aa7df1bbd5ea61",
                    symbol: "tDAI",
                    __typename: "Asset",
                  },
                  __typename: "FutureProduct",
                },
                __typename: "InstrumentConfiguration",
              },
              riskParameters: {
                __typename: "LogNormalRiskModel",
                riskAversionParameter: 0.0001,
                tau: 1.90129e-5,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 1.25,
                  __typename: "LogNormalModelParams",
                },
              },
              tradingMode: {
                tickSize: "0.00001",
                __typename: "ContinuousTrading",
              },
              __typename: "NewMarket",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
                    __typename: "Party",
                  },
                  datetime: "2021-08-16T21:30:05.893618695Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "480c6c47861bed938243d1a28a9c2270b868c98fbeb0ae7b3919437ea916b724",
          reference: "yVCbRaSJFvlvSaHRBsnsyf5B99kAjVI2S6aHQxy6",
          state: "Enacted",
          datetime: "2021-08-16T21:30:02.966547129Z",
          rejectionReason: null,
          party: {
            id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2021-08-16T21:31:21Z",
            enactmentDatetime: "2021-08-16T21:33:31Z",
            change: {
              decimalPlaces: 5,
              metadata: [
                "formerly:1F0BB6EB5703B099",
                "base:ETH",
                "quote:BTC",
                "class:fx/crypto",
                "quarterly",
                "sector:crypto",
              ],
              instrument: {
                name: "ETHBTC Quarterly (31 Dec 2021)",
                code: "ETHBTC.QM21",
                futureProduct: {
                  maturity: "2021-12-31T23:59:59Z",
                  settlementAsset: {
                    id: "5cfa87844724df6069b94e4c8a6f03af21907d7bc251593d08e4251043ee9f7c",
                    symbol: "tBTC",
                    __typename: "Asset",
                  },
                  __typename: "FutureProduct",
                },
                __typename: "InstrumentConfiguration",
              },
              riskParameters: {
                __typename: "LogNormalRiskModel",
                riskAversionParameter: 0.01,
                tau: 0.0001140771161,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 0.3,
                  __typename: "LogNormalModelParams",
                },
              },
              tradingMode: {
                tickSize: "0.00001",
                __typename: "ContinuousTrading",
              },
              __typename: "NewMarket",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
                    __typename: "Party",
                  },
                  datetime: "2021-08-16T21:30:05.893618695Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "582b3c311e8895b9d2a40290621121a997a90ec70a043806efda485b56cee2a6",
          reference: "MohsjRrxKCVqjy23XqHXSMLn1iWP6jfXFUUO0o5a",
          state: "Enacted",
          datetime: "2021-08-16T21:30:02.966547129Z",
          rejectionReason: null,
          party: {
            id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2021-08-16T21:31:21Z",
            enactmentDatetime: "2021-08-16T21:33:31Z",
            change: {
              decimalPlaces: 5,
              metadata: [
                "formerly:2839D9B2329C9E70",
                "base:AAVE",
                "quote:DAI",
                "class:fx/crypto",
                "monthly",
                "sector:defi",
              ],
              instrument: {
                name: "AAVEDAI Monthly (31 Dec 2021)",
                code: "AAVEDAI.MF21",
                futureProduct: {
                  maturity: "2021-12-31T23:59:59Z",
                  settlementAsset: {
                    id: "6d9d35f657589e40ddfb448b7ad4a7463b66efb307527fedd2aa7df1bbd5ea61",
                    symbol: "tDAI",
                    __typename: "Asset",
                  },
                  __typename: "FutureProduct",
                },
                __typename: "InstrumentConfiguration",
              },
              riskParameters: {
                __typename: "LogNormalRiskModel",
                riskAversionParameter: 0.01,
                tau: 0.0001140771161,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 0.5,
                  __typename: "LogNormalModelParams",
                },
              },
              tradingMode: {
                tickSize: "0.00001",
                __typename: "ContinuousTrading",
              },
              __typename: "NewMarket",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
                    __typename: "Party",
                  },
                  datetime: "2021-08-16T21:30:05.893618695Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "f51934815307a3ca9638ad2d056e0d0c3c3ca43b5196a3a8c7ca15c58e600b78",
          reference: "bEhW0pxEycxeag1Sm4QwK8HoJaNUl3iWXplC5YOw",
          state: "Enacted",
          datetime: "2021-08-16T21:30:03.645733534Z",
          rejectionReason: null,
          party: {
            id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2021-08-16T21:31:21Z",
            enactmentDatetime: "2021-08-16T21:33:31Z",
            change: {
              decimalPlaces: 5,
              metadata: [
                "formerly:3C58ED2A4A6C5D7E",
                "base:UNI",
                "quote:DAI",
                "class:fx/crypto",
                "monthly",
                "sector:defi",
              ],
              instrument: {
                name: "UNIDAI Monthly (31 Dec 2021)",
                code: "UNIDAI.MF21",
                futureProduct: {
                  maturity: "2021-12-31T23:59:59Z",
                  settlementAsset: {
                    id: "6d9d35f657589e40ddfb448b7ad4a7463b66efb307527fedd2aa7df1bbd5ea61",
                    symbol: "tDAI",
                    __typename: "Asset",
                  },
                  __typename: "FutureProduct",
                },
                __typename: "InstrumentConfiguration",
              },
              riskParameters: {
                __typename: "LogNormalRiskModel",
                riskAversionParameter: 0.01,
                tau: 0.0001140771161,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 0.5,
                  __typename: "LogNormalModelParams",
                },
              },
              tradingMode: {
                tickSize: "0.00001",
                __typename: "ContinuousTrading",
              },
              __typename: "NewMarket",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
                    __typename: "Party",
                  },
                  datetime: "2021-08-16T21:30:06.776233733Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "071cc014c738d8a4f545ac3981da7ffb020af7c1b4f9cb13bd8ee1646d7ca608",
          reference: "aU55K2T7QYZPfgIotruxFvEt9kx0v8Qv5aO6Qxuo",
          state: "Enacted",
          datetime: "2021-08-16T21:30:03.645733534Z",
          rejectionReason: null,
          party: {
            id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2021-08-16T21:31:21Z",
            enactmentDatetime: "2021-08-16T21:33:31Z",
            change: {
              decimalPlaces: 5,
              metadata: [
                "formerly:4899E01009F1A721",
                "quote:USD",
                "ticker:AAPL",
                "class:equities/single-stock-futures",
                "sector:tech",
                "listing_venue:NASDAQ",
                "country:US",
              ],
              instrument: {
                name: "Apple Monthly (31 Dec 2021)",
                code: "AAPL.MF21",
                futureProduct: {
                  maturity: "2021-12-31T23:59:59Z",
                  settlementAsset: {
                    id: "993ed98f4f770d91a796faab1738551193ba45c62341d20597df70fea6704ede",
                    symbol: "tUSDC",
                    __typename: "Asset",
                  },
                  __typename: "FutureProduct",
                },
                __typename: "InstrumentConfiguration",
              },
              riskParameters: {
                __typename: "LogNormalRiskModel",
                riskAversionParameter: 0.01,
                tau: 0.0001140771161,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 0.3,
                  __typename: "LogNormalModelParams",
                },
              },
              tradingMode: {
                tickSize: "0.00001",
                __typename: "ContinuousTrading",
              },
              __typename: "NewMarket",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
                    __typename: "Party",
                  },
                  datetime: "2021-08-16T21:30:06.776233733Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "9c7eabb5a482f5c5478dfd405d3420e6c919c31dea101b2a0480f7e603aa4b26",
          reference: "Vca1K34tNLv6LO3qmDbZp48A8x2xs6JsrilWMQDH",
          state: "Enacted",
          datetime: "2021-08-16T21:30:03.645733534Z",
          rejectionReason: null,
          party: {
            id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2021-08-16T21:31:21Z",
            enactmentDatetime: "2021-08-16T21:33:31Z",
            change: {
              decimalPlaces: 5,
              metadata: [
                "formerly:5A86B190C384997F",
                "quote:EURO",
                "ticker:TSLA",
                "class:equities/single-stock-futures",
                "sector:tech",
                "listing_venue:NASDAQ",
                "country:US",
              ],
              instrument: {
                name: "Tesla Quarterly (31 Dec 2021)",
                code: "TSLA.QM21",
                futureProduct: {
                  maturity: "2021-12-31T23:59:59Z",
                  settlementAsset: {
                    id: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
                    symbol: "tEURO",
                    __typename: "Asset",
                  },
                  __typename: "FutureProduct",
                },
                __typename: "InstrumentConfiguration",
              },
              riskParameters: {
                __typename: "LogNormalRiskModel",
                riskAversionParameter: 0.01,
                tau: 0.0001140771161,
                params: {
                  mu: 0,
                  r: 0.016,
                  sigma: 0.8,
                  __typename: "LogNormalModelParams",
                },
              },
              tradingMode: {
                tickSize: "0.00001",
                __typename: "ContinuousTrading",
              },
              __typename: "NewMarket",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "1",
              votes: [
                {
                  value: "Yes",
                  party: {
                    id: "6308f99aa2d2a34cb55da860d4cc7127c23ee7036832f947f4a69d30afb6797e",
                    __typename: "Party",
                  },
                  datetime: "2021-08-16T21:30:06.776233733Z",
                  __typename: "Vote",
                },
              ],
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "640000100000",
              totalWeight: "1",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
        {
          id: "ceedf3ac1b19bfaddf86ba1ce853e092991383ac9d76be3b20f5a254583fe2ae",
          reference: "",
          state: "Rejected",
          datetime: "2021-09-02T13:17:42.490013828Z",
          rejectionReason: "EnactTimeTooLate",
          party: {
            id: "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e",
            __typename: "Party",
          },
          terms: {
            closingDatetime: "2022-03-30T23:00:00Z",
            enactmentDatetime: "2022-09-29T23:00:00Z",
            change: {
              networkParameter: {
                key: "governance.proposal.updateNetParam.maxEnact",
                value: "8761h0m0s",
                __typename: "NetworkParameter",
              },
              __typename: "UpdateNetworkParameter",
            },
            __typename: "ProposalTerms",
          },
          votes: {
            yes: {
              totalTokens: "0",
              totalWeight: "0",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            no: {
              totalTokens: "0",
              totalWeight: "0",
              totalNumber: "0",
              votes: null,
              __typename: "ProposalVoteSide",
            },
            __typename: "ProposalVotes",
          },
          __typename: "Proposal",
        },
      ],
    };
    if (!tempData.proposals?.length) {
      return [];
    }

    return flow([
      compact,
      (arr) =>
        orderBy(
          arr,
          [
            (p) => new Date(p.terms.closingDatetime),
            (p) => new Date(p.terms.enactmentDatetime),
          ],
          ["asc", "asc"]
        ),
    ])(tempData.proposals);
  }, []);

  const { t } = useTranslation();

  if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <TemplateSidebar
      title={t("pageTitleGovernance")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Switch>
        <Route path={`${match.path}/associate`}>
          <AssociateContainer />
        </Route>
        <Route path={`${match.path}/disassociate`}>
          <DisassociateContainer />
        </Route>
        <Route path={match.path} exact>
          {error ? (
            <Callout intent="error" title={t("Something went wrong")}>
              <pre>{error.message}</pre>
            </Callout>
          ) : (
            <ProposalsList proposals={proposals} />
          )}
        </Route>
        <Route path={`${match.path}/:proposalId`}>
          {error ? (
            <Callout intent="error" title={t("Something went wrong")}>
              <pre>{error.message}</pre>
            </Callout>
          ) : (
            <Proposal proposals={proposals} />
          )}
        </Route>
      </Switch>
    </TemplateSidebar>
  );
};

export default GovernanceRouter;
