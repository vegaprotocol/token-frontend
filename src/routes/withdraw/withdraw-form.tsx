import "./withdraw-form.scss";
import React from "react";
import { WithdrawPage_party_accounts } from "./__generated__/WithdrawPage";
import { BigNumber } from "../../lib/bignumber";
import { HTMLSelect, FormGroup } from "@blueprintjs/core";
import { AmountInput } from "../../components/token-input";
import {
  Status as WithdrawStatus,
  useCreateWithdrawal,
} from "../../hooks/use-create-withdrawal";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { removeDecimal } from "../../lib/decimals";
import { useHistory } from "react-router";
import { StatefulButton } from "../../components/stateful-button";
import { Loader } from "../../components/loader";
import { Routes } from "../router-config";
import { useTranslation } from "react-i18next";
import { EthAddressInput } from "./eth-address-input";
import { ethers } from "ethers";

interface WithdrawFormProps {
  accounts: WithdrawPage_party_accounts[];
  currVegaKey: VegaKeyExtended;
  connectedAddress: string;
}

export const WithdrawForm = ({
  accounts,
  currVegaKey,
  connectedAddress,
}: WithdrawFormProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [amountStr, setAmount] = React.useState("");
  const [account, setAccount] = React.useState(accounts[0]);
  const [status, submit] = useCreateWithdrawal(currVegaKey.pub);
  const [destinationAddress, setDestinationAddress] =
    React.useState(connectedAddress);
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
      !destinationAddress ||
      amount.isLessThanOrEqualTo(0) ||
      amount.isGreaterThan(maximum)
    ) {
      return false;
    }
    return true;
  }, [destinationAddress, amount, maximum]);

  const addressValid = React.useMemo(() => {
    return ethers.utils.isAddress(destinationAddress);
  }, [destinationAddress]);

  // Navigate to complete withdrawals page once withdrawal
  // creation is complete
  React.useEffect(() => {
    if (status === WithdrawStatus.Success) {
      history.push(Routes.WITHDRAWALS);
    }
  }, [status, history]);

  return (
    <form
      className="withdraw-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid || !addressValid) return;

        submit(
          removeDecimal(amount, account.asset.decimals),
          account.asset.id,
          destinationAddress
        );
      }}
    >
      <FormGroup label={t("withdrawFormAssetLabel")} labelFor="asset">
        {accounts.length ? (
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
        ) : (
          <p className="text-muted">{t("withdrawFormNoAsset")}</p>
        )}
      </FormGroup>
      <EthAddressInput
        onChange={setDestinationAddress}
        address={destinationAddress}
        connectedAddress={connectedAddress}
        isValid={addressValid}
      />
      <FormGroup label={t("withdrawFormAmountLabel")} labelFor="amount">
        <AmountInput
          amount={amountStr}
          setAmount={setAmount}
          maximum={maximum}
          currency={"VEGA"}
        />
      </FormGroup>
      <StatefulButton
        type="submit"
        disabled={!addressValid || !valid || status === WithdrawStatus.Pending}
      >
        {status === WithdrawStatus.Pending ? (
          <>
            <Loader />
            <span>{t("withdrawFormSubmitButtonPending")}</span>
          </>
        ) : (
          t("withdrawFormSubmitButtonIdle", {
            amount: amountStr,
            symbol: account?.asset.symbol,
          })
        )}
      </StatefulButton>
    </form>
  );
};
