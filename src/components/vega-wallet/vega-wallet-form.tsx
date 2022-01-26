import { FormGroup, Intent } from "@blueprintjs/core";
import * as Sentry from "@sentry/react";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useRefreshAssociatedBalances } from "../../hooks/use-refresh-associated-balances";
import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";

interface FormFields {
  url: string;
  wallet: string;
  passphrase: string;
}

interface VegaWalletFormProps {
  onConnect: () => void;
  url: string;
  setUrl: (url: string) => void;
}

export const VegaWalletForm = ({
  onConnect,
  url,
  setUrl,
}: VegaWalletFormProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { appDispatch } = useAppState();
  const refreshAssociatedBalances = useRefreshAssociatedBalances();

  const [loading, setLoading] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormFields>({
    defaultValues: {
      url,
    },
  });

  const formUrl = useWatch({ name: "url", control });

  React.useEffect(() => {
    setUrl(formUrl);
  }, [formUrl, setUrl]);

  async function onSubmit(fields: FormFields) {
    setLoading(true);

    try {
      const tokenRes = await vegaWalletService.authTokenPost({
        wallet: fields.wallet,
        passphrase: fields.passphrase,
      });

      localStorage.setItem("vega_wallet_token", tokenRes.token);
    } catch (err) {
      console.log("token req fail", err);
      localStorage.clearItem("vega_wallet_token");
    }

    try {
      // const [tokenErr, token] = await vegaWalletService.getToken({
      //   wallet: fields.wallet,
      //   passphrase: fields.passphrase,
      //   url: fields.url,
      // });
      // const [, version] = await vegaWalletService.getVersion();

      // if (tokenErr) {
      //   setError("passphrase", { message: t(tokenErr) });
      //   setLoading(false);
      //   return;
      // }

      // const [keysErr, keys] = await vegaWalletService.getKeys();

      const res = await vegaWalletService.keysGet();
      console.log("res", res);

      let key = undefined;
      if (account && res.keys && res.keys.length) {
        key = res.keys[0].pub;
        // TODO: why is kye undefined
        await refreshAssociatedBalances(account, key as string);
      }

      appDispatch({
        type: AppStateActionType.VEGA_WALLET_INIT,
        // @ts-ignore
        keys: res.keys,
        key,
        // TODO: fetch version
        version: "0.1.1",
      });

      setLoading(false);
      onConnect();
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
      setError("passphrase", {
        message: "Something failed, maybe wrong passphrase",
      });
      setLoading(false);
      return;
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
        <input
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
