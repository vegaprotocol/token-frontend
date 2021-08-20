import React from "react";
import { FormGroup, Intent, Overlay } from "@blueprintjs/core";
import "./vega-wallet.scss";
import { useForm } from "react-hook-form";
import {
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import {
  WalletCard,
  WalletCardContent,
  WalletCardHeader,
} from "../wallet-card";
import { useTranslation } from "react-i18next";

export const VegaWallet = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);
  const { appState, appDispatch } = useAppState();

  React.useEffect(() => {
    async function run() {
      const isUp = await vegaWalletService.getStatus();
      if (isUp) {
        // dont handle error here, if get key fails just 'log' the user
        // out. Keys will be null and clearing the token is handled by the
        // vegaWalletServices.
        const [, keys] = await vegaWalletService.getKeys();
        appDispatch({ type: "VEGA_WALLET_INIT", keys });
      } else {
        appDispatch({ type: "VEGA_WALLET_DOWN" });
      }
    }

    run();
  }, [appDispatch]);

  return (
    <WalletCard>
      <WalletCardHeader onClick={() => setExpanded((curr) => !curr)}>
        <span>{t("vegaKey")}</span>
        {appState.currVegaKey && (
          <>
            <span className="vega-wallet__curr-key">
              {appState.currVegaKey.alias} {appState.currVegaKey.pubShort}
            </span>
          </>
        )}
      </WalletCardHeader>
      {!appState.vegaKeys ? (
        <VegaWalletNotConnected />
      ) : (
        <VegaWalletConnected
          currVegaKey={appState.currVegaKey}
          vegaKeys={appState.vegaKeys}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      )}
    </WalletCard>
  );
};

const VegaWalletNotConnected = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const [overlayOpen, setOverlayOpen] = React.useState(false);

  if (!appState.vegaWalletStatus) {
    return (
      <WalletCardContent>
        <div>{t("noService")}</div>
      </WalletCardContent>
    );
  }

  return (
    <WalletCardContent>
      <button
        onClick={() => setOverlayOpen(true)}
        className="vega-wallet__connect"
        type="button"
      >
        {t("connectVegaWallet")}
      </button>
      <Overlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        transitionDuration={0}
      >
        <div className="vega-wallet__overlay">
          <VegaWalletForm />
        </div>
      </Overlay>
    </WalletCardContent>
  );
};

interface VegaWalletConnectedProps {
  currVegaKey: VegaKeyExtended | null;
  vegaKeys: VegaKeyExtended[];
  expanded: boolean;
  setExpanded: (e: boolean) => void;
}

const VegaWalletConnected = ({
  currVegaKey,
  vegaKeys,
  expanded,
  setExpanded,
}: VegaWalletConnectedProps) => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const [disconnecting, setDisconnecting] = React.useState(false);

  async function handleDisconnect() {
    setDisconnecting(true);
    await vegaWalletService.revokeToken();
    appDispatch({ type: "VEGA_WALLET_DISCONNECT" });
  }

  return vegaKeys.length ? (
    <>
      {expanded && (
        <WalletCardContent>
          <div className="vega-wallet__expanded-container">
            <ul className="vega-wallet__key-list">
              {vegaKeys
                .filter((k) => currVegaKey && currVegaKey.pub !== k.pub)
                .map((k) => (
                  <li
                    key={k.pub}
                    onClick={() => {
                      appDispatch({ type: "VEGA_WALLET_SET_KEY", key: k });
                      setExpanded(false);
                    }}
                  >
                    {k.alias} {k.pubShort}
                  </li>
                ))}
            </ul>
            <button
              className="button-link"
              onClick={handleDisconnect}
              type="button"
            >
              {disconnecting ? t("awaitingDisconnect") : t("disconnect")}
            </button>
          </div>
        </WalletCardContent>
      )}
    </>
  ) : (
    <WalletCardContent>{t("noKeys")}</WalletCardContent>
  );
};

interface FormFields {
  url: string;
  wallet: string;
  passphrase: string;
}

const VegaWalletForm = () => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormFields>({
    defaultValues: {
      url: vegaWalletService.url,
    },
  });

  async function onSubmit(fields: FormFields) {
    setLoading(true);

    const [tokenErr] = await vegaWalletService.getToken({
      wallet: fields.wallet,
      passphrase: fields.passphrase,
    });

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

    appDispatch({ type: "VEGA_WALLET_INIT", keys });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label={t("urlLabel")}
        labelFor="url"
        intent={errors.url?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.url?.message}
      >
        <input {...register("url", { required: "Required" })} type="text" />
      </FormGroup>
      <FormGroup
        label={t("walletLabel")}
        labelFor="wallet"
        intent={errors.wallet?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.wallet?.message}
      >
        <input {...register("wallet", { required: "Required" })} type="text" />
      </FormGroup>
      <FormGroup
        label={t("passphraseLabel")}
        labelFor="passphrase"
        intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.passphrase?.message}
      >
        <input
          {...register("passphrase", { required: "Required" })}
          type="password"
        />
      </FormGroup>
      <button type="submit" className="fill" disabled={loading}>
        {loading ? t("vegaWalletConnecting") : t("vegaWalletConnect")}
      </button>
    </form>
  );
};
