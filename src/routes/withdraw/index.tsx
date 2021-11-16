import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Callout } from "../../components/callout";
import { Heading } from "../../components/heading";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { useTranslation } from "react-i18next";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import {
  WithdrawPage,
  WithdrawPageVariables,
} from "./__generated__/WithdrawPage";
import { AccountType } from "../../__generated__/globalTypes";
import { WithdrawForm } from "./withdraw-form";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";

const Withdraw = () => {
  return (
    <>
      <Heading title="Withdraw rewards" />
      <p>
        Staking rewards are paid into a Vega wallet. They can be withdrawn using
        the VEGA-ERC20 bridge.
      </p>
      <VegaWalletContainer>
        {(currVegaKey) => <WithdrawContainer currVegaKey={currVegaKey} />}
      </VegaWalletContainer>
      <Callout title="How do ERC20 withdrawals work on Vega">
        <p>
          To withdraw from Vega the network needs to agree that a party can
          withdraw funds (to ensure they are not being used for margin etc.),
          once this has happened it returns a signature that can be used in an
          Ethereum transaction to send the tokens to the given Ethereum address.
        </p>
      </Callout>
    </>
  );
};

const WITHDRAW_PAGE_QUERY = gql`
  query WithdrawPage($partyId: ID!) {
    party(id: $partyId) {
      id
      accounts {
        balance
        balanceFormatted @client
        type
        asset {
          id
          symbol
          decimals
        }
      }
      withdrawals {
        id
        amount
        asset {
          id
          symbol
          decimals
        }
        status
        createdTimestamp
        withdrawnTimestamp
        txHash
        details {
          ... on Erc20WithdrawalDetails {
            receiverAddress
          }
        }
      }
    }
  }
`;

interface WithdrawContainerProps {
  currVegaKey: VegaKeyExtended;
}

export const WithdrawContainer = ({ currVegaKey }: WithdrawContainerProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery<
    WithdrawPage,
    WithdrawPageVariables
  >(WITHDRAW_PAGE_QUERY, {
    variables: { partyId: currVegaKey?.pub! },
  });

  const accounts = React.useMemo(() => {
    if (!data?.party?.accounts) return [];
    // You can only withdraw from general accounts
    return data.party.accounts.filter((a) => a.type === AccountType.General);
  }, [data]);

  // Note there is a small period where the withdrawal might have a tx hash but is technically
  // not complete yet as the tx hash gets set before the transaction is confirmed
  const hasPendingWithdrawals = React.useMemo(() => {
    if (!data?.party?.withdrawals?.length) return false;
    return data.party.withdrawals.some((w) => w.txHash === null);
  }, [data]);

  if (error) {
    return (
      <section>
        <p>{t("Something went wrong")}</p>
        {error && <pre>{error.message}</pre>}
      </section>
    );
  }

  if (loading || !data) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <>
      {hasPendingWithdrawals && (
        <Callout title="You have incomplete withdrawals" intent="warn">
          <p>
            You have withdrawals that have been released from the Vega network
            but not yet actioned on Ethereum
          </p>
          <p>
            <Link to={Routes.WITHDRAWALS}>View incomplete withdrawals</Link>
          </p>
        </Callout>
      )}
      <WithdrawForm accounts={accounts} currVegaKey={currVegaKey} />
    </>
  );
};

export default Withdraw;
