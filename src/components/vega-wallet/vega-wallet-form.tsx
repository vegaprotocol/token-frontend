import { FormGroup, Intent, Switch } from "@blueprintjs/core";
import React from "react";
import * as Sentry from "@sentry/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useRefreshAssociatedBalances } from "../../hooks/use-refresh-associated-balances";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import {
  HOSTED_WALLET_URL,
  vegaWalletService,
} from "../../lib/vega-wallet/vega-wallet-service";
import { Flags } from "../../config";

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
  const refreshAssociatedBalances = useRefreshAssociatedBalances();

  const [loading, setLoading] = React.useState(false);
  const [hostedWallet, setHostedWallet] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<FormFields>({
    defaultValues: {
      url: vegaWalletService.url,
    },
  });

  async function onSubmit(fields: FormFields) {
    setLoading(true);

    try {
      const [tokenErr] = await vegaWalletService.getToken({
        wallet: fields.wallet,
        passphrase: fields.passphrase,
        url: fields.url,
      });
      const [, version] = await vegaWalletService.getVersion();

      if (tokenErr) {
        setError("passphrase", { message: t(tokenErr) });
        setLoading(false);
        return;
      }

      const [keysErr, keys] = await vegaWalletService.getKeys();

      if (keysErr) {
        setError("passphrase", { message: t(keysErr) });
        setLoading(false);
        return;
      }

      let key = undefined;
      if (ethAddress && keys && keys.length) {
        key = vegaWalletService.key || keys[0].pub;
        await refreshAssociatedBalances(ethAddress, key);
      }

      appDispatch({
        type: AppStateActionType.VEGA_WALLET_INIT,
        keys,
        key,
        version,
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
      {Flags.HOSTED_WALLET_ENABLED ? (
        <FormGroup labelFor="hostedWallet" label={t("hostedSwitchLabel")}>
          <Switch
            large={true}
            name="hostedWallet"
            checked={hostedWallet}
            onChange={(a) => {
              const input = a.target as HTMLInputElement;
              setHostedWallet(input.checked);
              setValue(
                "url",
                input.checked ? HOSTED_WALLET_URL : vegaWalletService.url,
                {
                  shouldValidate: false,
                }
              );
            }}
          />
        </FormGroup>
      ) : null}
      <FormGroup
        label={t("urlLabel")}
        labelFor="url"
        intent={errors.url?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.url?.message}
      >
        <input
          disabled={hostedWallet}
          {...register("url", { required })}
          type="text"
          className="bp3-input"
        />
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
          className="bp3-input"
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
          className="bp3-input"
        />
      </FormGroup>
      <button
        data-testid="wallet-login"
        type="submit"
        disabled={loading}
        className="fill"
      >
        {loading ? t("vegaWalletConnecting") : t("vegaWalletConnect")}
      </button>
    </form>
  );
};
