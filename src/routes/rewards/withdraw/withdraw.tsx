import { HTMLSelect } from "@blueprintjs/core";
import BigNumber from "bignumber.js";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { FormGroup } from "../../../components/form-group";
import { Heading } from "../../../components/heading";
import { SplashLoader } from "../../../components/splash-loader";
import { SplashScreen } from "../../../components/splash-screen";
import { AmountInput } from "../../../components/token-input";
import {
  WithdrawPage,
  WithdrawPageVariables,
  WithdrawPage_party_accounts,
} from "./__generated__/WithdrawPage";
import { AccountType } from "../../../__generated__/globalTypes";
import { useVegaUser } from "../../../hooks/use-vega-user";

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

export const WithdrawContainer = () => {
  const { t } = useTranslation();
  const { currVegaKey } = useVegaUser();
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

  return <Withdraw accounts={accounts} />;
};

interface WithdrawProps {
  accounts: WithdrawPage_party_accounts[];
}

export const Withdraw = ({ accounts }: WithdrawProps) => {
  const [amount, setAmount] = React.useState("");
  const [selectedAsset, setSelectedAsset] = React.useState(
    accounts[0].asset.id
  );

  const account = React.useMemo(() => {
    return accounts.find((a) => a.asset.id === selectedAsset);
  }, [selectedAsset, accounts]);

  const maximum = React.useMemo(() => {
    if (account) {
      return new BigNumber(account.balanceFormatted);
    }

    return new BigNumber(0);
  }, [account]);

  return (
    <section>
      <Heading title="Withdraw rewards" />
      <p>
        Staking rewards are paid into a Vega wallet. They can be withdrawn using
        the VEGA-ERC20 bridge.
      </p>
      <form onSubmit={() => alert("TODO: Submit")}>
        <FormGroup label="What would you like to withdraw" labelFor="asset">
          <HTMLSelect
            name="asset"
            id="asset"
            options={accounts.map((a) => ({
              label: `${a.asset.symbol} (${a.balanceFormatted})`,
              value: a.asset.id,
            }))}
            onChange={(e) => {
              setSelectedAsset(e.currentTarget.value);
            }}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="How much would you like to withdraw"
          labelFor="amount"
        >
          <AmountInput
            amount={amount}
            setAmount={setAmount}
            maximum={maximum}
            currency={"VEGA"}
          />
        </FormGroup>
        <button type="submit">
          Withdraw {amount} {account?.asset.symbol} tokens
        </button>
      </form>
    </section>
  );
};
