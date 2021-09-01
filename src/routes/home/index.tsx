import "./home.scss";

import { Trans, useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TokenDetails } from "./token-details";
import { Link, useHistory } from "react-router-dom";
import { Web3Container } from "../../components/web3-container";
import { TrancheContainer } from "../../components/tranche-container";
import { VegaTokenContainer } from "../../components/vega-token-container";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import BigNumber from "bignumber.js";
import { NodeData } from "./__generated__/NodeData";
import { Routes } from "../router-config";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";

export const TOTAL_STAKED_QUERY = gql`
  query NodeData {
    nodeData {
      stakedTotal
    }
  }
`;

const Home = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const history = useHistory();
  const { data } = useQuery<NodeData>(TOTAL_STAKED_QUERY);
  const totalStaked = React.useMemo(() => {
    return new BigNumber(data?.nodeData?.stakedTotal || "0").toString();
  }, [data]);

  return (
    <TemplateSidebar sidebar={[<EthWallet />]}>
      <Web3Container>
        {(address) => (
          <VegaTokenContainer>
            {({ totalSupply }) => (
              <TrancheContainer address={address}>
                {() => {
                  return (
                    <>
                      <h2>{t("The Vega Token")}</h2>

                      <TokenDetails
                        totalSupply={totalSupply}
                        totalStaked={totalStaked}
                      />
                      <h2>{t("Token Vesting")}</h2>

                      <p>
                        {t(
                          "Most VEGA tokens are held in a vesting contract. This means that they cannot be transferred between wallets until their vesting term is complete"
                        )}
                      </p>
                      <button
                        onClick={() => history.push("/vesting")}
                        style={{ marginBottom: 8, width: "100%" }}
                      >
                        {t(
                          "Check to see if you can redeem unlocked VEGA tokens"
                        )}
                      </button>
                      <p>
                        <Trans
                          i18nKey="Tokens are held in different <trancheLink>Tranches</trancheLink>. Each tranche has its own schedule for how long the tokens are locked."
                          components={{
                            trancheLink: <Link to={Routes.TRANCHES} />,
                          }}
                        />
                      </p>

                      <h2>{t("USE YOUR VEGA TOKENS")}</h2>

                      <p>
                        {t(
                          "To use your tokens on the Vega network they need to be associated with a Vega wallet/key."
                        )}
                      </p>
                      <p>
                        {t(
                          "This can happen both while held in the vesting contract as well as when redeemed."
                        )}
                      </p>

                      <p>
                        <a href="https://github.com/vegaprotocol/go-wallet">
                          {t(" Get a Vega wallet")}
                        </a>
                      </p>
                      <p>
                        <Link to={`${Routes.VESTING}/associate`}>
                          {t("Associate VEGA tokens")}
                        </Link>
                      </p>
                      <div style={{ display: "flex", gap: 36 }}>
                        <div>
                          <h2>{t("Governance")}</h2>
                          <p>
                            {t(
                              "VEGA token holders can vote on proposed changes to the network and create proposals."
                            )}
                          </p>
                          <p>
                            <button
                              className="button-secondary"
                              onClick={() => history.push("/governance")}
                            >
                              {t("Read about Governance on Vega")}
                            </button>
                          </p>
                        </div>

                        <div>
                          <h2>{t("Staking")}</h2>
                          <p>
                            {t(
                              "VEGA token holders can nominate a validator node and receive staking rewards."
                            )}
                          </p>
                          <button
                            className="button-secondary"
                            onClick={() => history.push("/staking")}
                          >
                            {t("Read about staking on Vega")}
                          </button>
                        </div>
                      </div>
                    </>
                  );
                }}
              </TrancheContainer>
            )}
          </VegaTokenContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default Home;
