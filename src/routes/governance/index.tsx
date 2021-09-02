import React from "react";
import compact from "lodash/compact";
import flow from "lodash/flow";
import orderBy from "lodash/orderBy";

import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { ProposalsList } from "./proposals-list";
import { proposals } from "./_temp_/proposals";
import { Callout } from "../../components/callout";

export const proposalsQuery = gql`
  query proposals {
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

const GovernanceRouter = () => {
  const { data, loading, error, subscribeToMore } = useQuery<proposals, never>(
    proposalsQuery,
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
    // }, [subscribeToMore, notify]);
  }, [subscribeToMore]);

  const tempData = {
    proposals: [
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
            instrument: {
              name: "ETHBTC Quarterly (31 Dec 2021)",
              __typename: "InstrumentConfiguration",
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
            instrument: {
              name: "AAVEDAI Monthly (31 Dec 2021)",
              __typename: "InstrumentConfiguration",
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
            instrument: {
              name: "UNIDAI Monthly (31 Dec 2021)",
              __typename: "InstrumentConfiguration",
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
            instrument: {
              name: "Apple Monthly (31 Dec 2021)",
              __typename: "InstrumentConfiguration",
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
            instrument: {
              name: "Tesla Quarterly (31 Dec 2021)",
              __typename: "InstrumentConfiguration",
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
            instrument: {
              name: "BTCUSD Monthly (31 Dec 2021)",
              __typename: "InstrumentConfiguration",
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
    ],
  };

  const proposals = React.useMemo(() => {
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
  }, [tempData]);

  const { t } = useTranslation();


  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <pre>{error.message}</pre>
      </Callout>
    );
  }

  if (loading) {
    return <div>{t("Loading")}</div>;
  }

  return (
    <TemplateDefault title={t("pageTitleGovernance")}>
      <h1>{t("Governance")}</h1>
      <p>{t("This page lists proposed changes to the Vega network.")}</p>
      <p>
        {t(
          "VEGA token holders can vote for or against proposals as well as make their own."
        )}
      </p>
      <p>
        {t(
          "Each proposal needs both a required majority of votes (e.g 66% but this differs by proposal type) and to meet a minimum threshold of votes."
        )}
      </p>
      <h1>{t("Proposals")}</h1>
      <ProposalsList data={proposals} />
    </TemplateDefault>
  );
};

export default GovernanceRouter;
