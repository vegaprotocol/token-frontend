import "./withdraw-form.scss";
import React from "react";
import { WithdrawPage_party_accounts } from "./__generated__/WithdrawPage";
import { BigNumber } from "../../lib/bignumber";
import { HTMLSelect, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { AmountInput } from "../../components/token-input";
import {
  Status as WithdrawStatus,
  useCreateWithdrawal,
} from "../../hooks/use-create-withdrawal";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { removeDecimal } from "../../lib/decimals";
import { useHistory } from "react-router";
import { StatefulButton } from "../../components/stateful-button";
import { Loader } from "../../components/loader";
import { Routes } from "../router-config";
import { useTranslation } from "react-i18next";
import { EthWalletContainer } from "../../components/eth-wallet-container";
import { ethers } from "ethers";
import { debounce } from "lodash";
import { Callout } from "../../components/callout";
import { Ethereum } from "../../components/icons";

interface EthAddressInputProps {
  address: string;
  onChange: (newAddress: string) => void;
}

interface EthAddressSelectorProps {
  address: string;
  connectedAddress: string;
  onChange: (newAddress: string) => void;
}

const EthAddressSelector = ({
  connectedAddress,
  address,
  onChange,
}: EthAddressSelectorProps) => {
  const [useConnectedWallet, setUseConnectedWallet] =
    React.useState<boolean>(false);
  const [addressValid, setAddressValid] = React.useState<boolean>(false);
  const [validationLoading, setValidationLoading] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    if (useConnectedWallet) {
      onChange(connectedAddress);
    }
  }, [connectedAddress, onChange, useConnectedWallet]);

  const validateAddress = React.useCallback(async () => {
    setAddressValid(await ethers.utils.isAddress(address));
    setValidationLoading(false);
  }, [address]);

  const addressValidationDebounced = React.useMemo(
    () => debounce(validateAddress, 1000),
    [validateAddress]
  );

  React.useEffect(() => {
    if (address === connectedAddress || useConnectedWallet) {
      setAddressValid(true);
      return;
    }
    setValidationLoading(true);
    addressValidationDebounced();
  }, [
    address,
    addressValidationDebounced,
    connectedAddress,
    useConnectedWallet,
  ]);

  return (
    <>
      <InputGroup
        data-testid="token-amount-input"
        className="token-input__input"
        name="ethAddressInput"
        onChange={(e) => onChange(e.target.value)}
        value={address}
        disabled={useConnectedWallet}
        intent={Intent.NONE}
        leftElement={<Ethereum />}
        autoComplete="off"
        type="text"
      />
      <button
        onClick={() => setUseConnectedWallet(!useConnectedWallet)}
        className="button-link fill"
      >
        {useConnectedWallet ? "Enter address manually" : "Use connected wallet"}
      </button>

      {validationLoading ? (
        <Loader />
      ) : addressValid ? null : (
        <Callout intent="warn">
          Looks like that address isn't a valid Ethereum address, please check
          and try again
        </Callout>
      )}
    </>
  );
};

const EthAddressInput = ({ onChange, address }: EthAddressInputProps) => {
  const { t } = useTranslation();
  return (
    <FormGroup
      label={t("Connected Ethereum address")}
      labelFor="ethAddressInput"
    >
      <EthWalletContainer>
        {(connectedAddress) => (
          <EthAddressSelector
            address={address}
            connectedAddress={connectedAddress}
            onChange={onChange}
          />
        )}
      </EthWalletContainer>
    </FormGroup>
  );
};

interface WithdrawFormProps {
  accounts: WithdrawPage_party_accounts[];
  currVegaKey: VegaKeyExtended;
}

export const WithdrawForm = ({ accounts, currVegaKey }: WithdrawFormProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { ethAddress } = useWeb3();
  const [amountStr, setAmount] = React.useState("");
  const [account, setAccount] = React.useState(accounts[0]);
  const [status, submit] = useCreateWithdrawal(currVegaKey.pub);
  const [destinationAddress, setDestinationAddress] = React.useState("");
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
        disabled={!valid || status === WithdrawStatus.Pending}
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
