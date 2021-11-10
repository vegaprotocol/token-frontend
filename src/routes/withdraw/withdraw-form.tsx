import React from "react";
import { WithdrawPage_party_accounts } from "./__generated__/WithdrawPage";
import { BigNumber } from "../../lib/bignumber";
import { FormGroup } from "../../components/form-group";
import { HTMLSelect } from "@blueprintjs/core";
import { AmountInput } from "../../components/token-input";

interface WithdrawFormProps {
  accounts: WithdrawPage_party_accounts[];
}

export const WithdrawForm = ({ accounts }: WithdrawFormProps) => {
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
      <FormGroup label="How much would you like to withdraw" labelFor="amount">
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
  );
};
