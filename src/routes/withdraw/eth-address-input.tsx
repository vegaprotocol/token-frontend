import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { Callout } from "@vegaprotocol/ui-toolkit";
import React from "react";
import { useTranslation } from "react-i18next";

import { Ethereum } from "../../components/icons";

interface EthAddressSelectorProps {
  address: string;
  connectedAddress: string;
  onChange: (newAddress: string) => void;
  isValid: boolean;
}

export const EthAddressInput = ({
  connectedAddress,
  address,
  onChange,
  isValid,
}: EthAddressSelectorProps) => {
  const { t } = useTranslation();
  const [useConnectedWallet, setUseConnectedWallet] =
    React.useState<boolean>(true);
  React.useEffect(() => {
    if (useConnectedWallet) {
      onChange(connectedAddress);
    }
  }, [connectedAddress, onChange, useConnectedWallet]);

  return (
    <FormGroup label={t("To")} labelFor="ethAddressInput">
      <InputGroup
        data-testid="current-eth-address-withdrawals"
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
        type="button"
        onClick={() => setUseConnectedWallet(!useConnectedWallet)}
        data-testid="enter-wallet-address-link"
        className="button-link fill"
      >
        {useConnectedWallet ? t("enterAddress") : t("useConnectedWallet")}
      </button>

      {isValid ? null : <Callout intent="warn" datatest-id="invalid-address-callout" >{t("invalidAddress")}</Callout>}
    </FormGroup>
  );
};
