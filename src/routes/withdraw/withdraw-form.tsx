import React from "react";
import { WithdrawPage_party_accounts } from "./__generated__/WithdrawPage";
import { BigNumber } from "../../lib/bignumber";
import { HTMLSelect, FormGroup, Button, Intent } from "@blueprintjs/core";
import { AmountInput } from "../../components/token-input";
import { EthWalletContainer } from "../../components/eth-wallet-container";
import {
  Status as WithdrawStatus,
  useCreateWithdrawal,
} from "../../hooks/use-create-withdrawal";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { removeDecimal } from "../../lib/decimals";
import { useHistory } from "react-router";

interface WithdrawFormProps {
  accounts: WithdrawPage_party_accounts[];
  currVegaKey: VegaKeyExtended;
}

export const WithdrawForm = ({ accounts, currVegaKey }: WithdrawFormProps) => {
  const history = useHistory();
  const { ethAddress } = useWeb3();
  const [amountStr, setAmount] = React.useState("");
  const [account, setAccount] = React.useState(accounts[0]);
  const [status, submit] = useCreateWithdrawal(currVegaKey.pub);

  const amount = React.useMemo(
    () => new BigNumber(amountStr || 0),
    [amountStr]
  );

  const maximum = React.useMemo(() => {
    if (account) {
      return new BigNumber(account.balanceFormatted);
    }

    return new BigNumber(0);
  }, [account]);

  const valid = React.useMemo(() => {
    if (
      !ethAddress ||
      amount.isLessThanOrEqualTo(0) ||
      amount.isGreaterThan(maximum)
    ) {
      return false;
    }
    return true;
  }, [ethAddress, amount, maximum]);

  React.useEffect(() => {
    if (status === WithdrawStatus.Success) {
      history.push("/withdraw/pending");
    }
  }, [status, history]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid) return;

        submit(
          removeDecimal(amount, account.asset.decimals),
          account.asset.id,
          ethAddress
        );
      }}
    >
      <FormGroup label="What would you like to withdraw" labelFor="asset">
        <HTMLSelect
          name="asset"
          id="asset"
          options={accounts.map((a) => ({
            label: `${a.asset.symbol} (${a.balanceFormatted})`,
            value: a.asset.id,
          }))}
          onChange={(e) => {
            const account = accounts.find(
              (a) => a.asset.id === e.currentTarget.value
            );
            if (!account) throw new Error("No account");
            setAccount(account);
          }}
          fill={true}
        />
      </FormGroup>
      <FormGroup label="To">
        <EthWalletContainer>
          {(ethAddress) => <div>{ethAddress}</div>}
        </EthWalletContainer>
      </FormGroup>
      <FormGroup label="How much would you like to withdraw" labelFor="amount">
        <AmountInput
          amount={amountStr}
          setAmount={setAmount}
          maximum={maximum}
          currency={"VEGA"}
        />
      </FormGroup>
      <button
        type="submit"
        disabled={!valid || status === WithdrawStatus.Pending}
      >
        {status === WithdrawStatus.Pending
          ? "Preparing"
          : `Withdraw ${amountStr} ${account?.asset.symbol} tokens`}
      </button>
    </form>
  );
};
