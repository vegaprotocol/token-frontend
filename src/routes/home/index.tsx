import "./home.scss";

import { Trans, useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TokenDetails } from "./token-details";
import { Link, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { NodeData } from "./__generated__/NodeData";
import { Routes } from "../router-config";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { Flags } from "../../flags";
import { BigNumber } from "../../lib/bignumber";

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
  const { appState } = useAppState();
  const { data } = useQuery<NodeData>(TOTAL_STAKED_QUERY);
  const totalStaked = React.useMemo(() => {
    return new BigNumber(data?.nodeData?.stakedTotal || "0").toString();
  }, [data]);

  return (
    <TemplateSidebar sidebar={[<EthWallet />]}>
      <h2>{t("The Vega Token")}</h2>

      <TokenDetails
        totalSupply={appState.totalSupply}
        totalStaked={totalStaked}
      />
      <h2>{t("Token Vesting")}</h2>

      <p>
        {t(
          "The vesting contract holds VEGA tokens until they have become unlocked."
        )}
      </p>
      <p>
        <Trans
          i18nKey="Tokens are held in different <trancheLink>Tranches</trancheLink>. Each tranche has its own schedule for how the tokens are unlocked."
          components={{
            trancheLink: <Link to={Routes.TRANCHES} />,
          }}
        />
      </p>
      <p>
        {t(
          "Once unlocked they can be redeemed from the contract so that you can transfer them between wallets."
        )}
      </p>
      <button onClick={() => history.push("/vesting")} className="fill">
        {t("Check to see if you can redeem unlocked VEGA tokens")}
      </button>

      <h2>{t("USE YOUR VEGA TOKENS")}</h2>
      {Flags.MAINNET_DISABLED ? (
        <p>{t("mainnetDisableHome")}</p>
      ) : (
        <>
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
              {t("Get a Vega wallet")}
            </a>
          </p>
          <p>
            <Link to={`${Routes.STAKING}/associate`}>
              {t("Associate VEGA tokens")}
            </Link>
          </p>
          <div style={{ display: "flex", gap: 36 }}>
            <div style={{ flex: 1 }}>
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
                  {t("View Governance proposals")}
                </button>
              </p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
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
              {t("Nominate a validator")}
            </button>
          </div>
        </>
      )}
    </TemplateSidebar>
  );
};

export default Home;
