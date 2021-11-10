import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Callout } from "../../components/callout";
import { Heading } from "../../components/heading";
import { VegaWalletPrompt } from "../../components/vega-wallet-prompt";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import {
  WithdrawPage,
  WithdrawPageVariables,
} from "./__generated__/WithdrawPage";
import { AccountType } from "../../__generated__/globalTypes";
import { WithdrawForm } from "./withdraw-form";

export const WithdrawIndex = () => {
  return (
    <>
      <Heading title="Withdraw rewards" />
      <p>
        Staking rewards are paid into a Vega wallet. They can be withdrawn using
        the VEGA-ERC20 bridge.
      </p>
      <VegaWalletPrompt>
        {(currVegaKey) => <WithdrawContainer currVegaKey={currVegaKey} />}
      </VegaWalletPrompt>
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
    }
  }
`;

interface WithdrawContainerProps {
  currVegaKey: VegaKeyExtended;
}

export const WithdrawContainer = ({ currVegaKey }: WithdrawContainerProps) => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const { data, loading, error } = useQuery<
    WithdrawPage,
    WithdrawPageVariables
  >(WITHDRAW_PAGE_QUERY, {
    variables: { partyId: currVegaKey?.pub! },
    skip: !currVegaKey,
  });

  const accounts = React.useMemo(() => {
    if (!data?.party?.accounts) return [];
    return data.party.accounts.filter((a) => a.type === AccountType.General);
  }, [data]);

  if (!currVegaKey) {
    return (
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
            isOpen: true,
          })
        }
      >
        {t("connectVegaWallet")}
      </button>
    );
  }

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

  return <WithdrawForm accounts={accounts} />;
};
