import "./vega-wallet-form.scss";
import { FormGroup, Intent } from "@blueprintjs/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useVegaStaking } from "../../hooks/use-vega-staking";
import { useVegaWallet } from "../../hooks/use-vega-wallet";

interface FormFields {
  url: string;
  wallet: string;
  passphrase: string;
}

interface VegaWalletFormProps {
  onConnect: () => void;
}

export const VegaWalletForm = ({ onConnect }: VegaWalletFormProps) => {
  const { t } = useTranslation();
  const {
    appDispatch,
    appState: { ethAddress: address },
  } = useAppState();
  const vegaWallet = useVegaWallet();
  const staking = useVegaStaking();

  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormFields>({
    defaultValues: {
      url: vegaWallet.url,
    },
  });

  async function onSubmit(fields: FormFields) {
    setLoading(true);
    const [tokenErr] = await vegaWallet.getToken({
      wallet: fields.wallet,
      passphrase: fields.passphrase,
    });

    if (tokenErr) {
      setError("passphrase", { message: t(tokenErr) });
      setLoading(false);
      return;
    }

    const [keysErr, keys] = await vegaWallet.getKeys();

    if (keysErr) {
      setError("passphrase", { message: t(keysErr) });
      setLoading(false);
      return;
    }
    let vegaAssociatedBalance = null;
    if (address && keys && keys.length) {
      vegaAssociatedBalance = await staking.stakeBalance(address, keys[0].pub);
    }
    appDispatch({
      type: AppStateActionType.VEGA_WALLET_INIT,
      keys,
      vegaAssociatedBalance,
    });
    setLoading(false);
    onConnect();
  }

  const required = t("required");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="vega-wallet-form">
      <FormGroup
        label={t("urlLabel")}
        labelFor="url"
        intent={errors.url?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.url?.message}
      >
        <input {...register("url", { required })} type="text" />
      </FormGroup>
      <FormGroup
        label={t("walletLabel")}
        labelFor="wallet"
        intent={errors.wallet?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.wallet?.message}
      >
        <input
          data-testid="wallet-name"
          {...register("wallet", { required })}
          type="text"
        />
      </FormGroup>
      <FormGroup
        label={t("passphraseLabel")}
        labelFor="passphrase"
        intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.passphrase?.message}
      >
        <input
          data-testid="wallet-password"
          {...register("passphrase", { required })}
          type="password"
        />
      </FormGroup>
      <button
        data-testid="wallet-login"
        type="submit"
        disabled={loading}
        className="vega-wallet-form__submit"
      >
        {loading ? t("vegaWalletConnecting") : t("vegaWalletConnect")}
      </button>
    </form>
  );
};
