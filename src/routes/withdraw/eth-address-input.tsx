import React from "react";
import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { Loader } from "../../components/loader";
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
        required={true}
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

export const EthAddressInput = ({
  onChange,
  address,
}: EthAddressInputProps) => {
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
