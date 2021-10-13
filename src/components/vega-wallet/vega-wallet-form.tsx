import "./vega-wallet-form.scss";
import { FormGroup, Intent } from "@blueprintjs/core";
import React from "react";
import * as Sentry from "@sentry/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { useRefreshAssociatedBalances } from "../../hooks/use-refresh-associated-balances";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

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
  const { ethAddress } = useWeb3();
  const { appDispatch } = useAppState();
  const vegaWallet = useVegaWallet();
  const refreshAssociatedBalances = useRefreshAssociatedBalances();

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

    try {
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

      if (ethAddress && keys && keys.length) {
        await refreshAssociatedBalances(ethAddress, keys[0].pub);
      }

      appDispatch({
        type: AppStateActionType.VEGA_WALLET_INIT,
        keys,
      });
      setLoading(false);
      onConnect();
    } catch (err) {
      Sentry.captureException(err);
    }
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
