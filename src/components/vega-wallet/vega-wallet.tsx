import React from "react";
import { FormGroup, Intent } from "@blueprintjs/core";
import "./vega-wallet.scss";
import { useForm } from "react-hook-form";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
  VegaWalletStatus,
} from "../../contexts/app-state/app-state-context";
import {
  WalletCard,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { VegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";
import { useVegaStaking } from "../../hooks/use-vega-staking";

export const VegaWallet = () => {
  const { t } = useTranslation();
  const vegaWallet = useVegaWallet();
  const [expanded, setExpanded] = React.useState(false);
  const { appState, appDispatch } = useAppState();
  const staking = useVegaStaking();

  React.useEffect(() => {
    async function run() {
      const isUp = await vegaWallet.getStatus();
      if (isUp) {
        // dont handle error here, if get key fails just 'log' the user
        // out. Keys will be null and clearing the token is handled by the
        // vegaWalletServices.
        const [, keys] = await vegaWallet.getKeys();
        let vegaAssociatedBalance = null;
        if (appState.address && keys && keys.length) {
          vegaAssociatedBalance = await staking.stakeBalance(
            appState.address,
            keys[0].pub
          );
        }
        appDispatch({
          type: AppStateActionType.VEGA_WALLET_INIT,
          keys,
          vegaAssociatedBalance,
        });
      } else {
        appDispatch({ type: AppStateActionType.VEGA_WALLET_DOWN });
      }
    }

    run();
  }, [appDispatch, appState.address, staking, vegaWallet]);

  const child = !appState.vegaKeys ? (
    <VegaWalletNotConnected vegaWallet={vegaWallet} />
  ) : (
    <VegaWalletConnected
      vegaWallet={vegaWallet}
      currVegaKey={appState.currVegaKey}
      vegaKeys={appState.vegaKeys}
      expanded={expanded}
      setExpanded={setExpanded}
    />
  );

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
      {appState.vegaWalletStatus !== VegaWalletStatus.Pending && child}
    </WalletCard>
  );
};

interface VegaWalletNotConnectedProps {
  vegaWallet: VegaWalletService;
}

const VegaWalletNotConnected = ({
  vegaWallet,
}: VegaWalletNotConnectedProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const [formOpen, setFormOpen] = React.useState(false);

  if (appState.vegaWalletStatus === VegaWalletStatus.None) {
    return (
      <WalletCardContent>
        <div>{t("noService")}</div>
      </WalletCardContent>
    );
  }

  return (
    <WalletCardContent>
      {formOpen ? (
        <VegaWalletForm
          vegaWallet={vegaWallet}
          cancel={() => setFormOpen(false)}
        />
      ) : (
        <button
          onClick={() => setFormOpen(true)}
          className="vega-wallet__connect"
          data-testid="connect-vega"
          type="button"
        >
          {t("connectVegaWallet")}
        </button>
      )}
    </WalletCardContent>
  );
};

interface VegaWalletConnectedProps {
  vegaWallet: VegaWalletService;
  currVegaKey: VegaKeyExtended | null;
  vegaKeys: VegaKeyExtended[];
  expanded: boolean;
  setExpanded: (e: boolean) => void;
}

const VegaWalletConnected = ({
  vegaWallet,
  currVegaKey,
  vegaKeys,
  expanded,
  setExpanded,
}: VegaWalletConnectedProps) => {
  const { t } = useTranslation();
  const {
    appDispatch,
    appState: { address, vegaAssociatedBalance },
  } = useAppState();
  const [disconnecting, setDisconnecting] = React.useState(false);
  const staking = useVegaStaking();

  const handleDisconnect = React.useCallback(
    async function () {
      setDisconnecting(true);
      await vegaWallet.revokeToken();
      appDispatch({ type: AppStateActionType.VEGA_WALLET_DISCONNECT });
    },
    [appDispatch, vegaWallet]
  );

  const changeKey = React.useCallback(
    async (k: VegaKeyExtended) => {
      let vegaAssociatedBalance = null;
      if (address) {
        vegaAssociatedBalance = await staking.stakeBalance(address, k.pub);
      }
      appDispatch({
        type: AppStateActionType.VEGA_WALLET_SET_KEY,
        key: k,
        vegaAssociatedBalance: vegaAssociatedBalance,
      });
      setExpanded(false);
    },
    [address, appDispatch, setExpanded, staking]
  );

  return vegaKeys.length ? (
    <>
      <WalletCardContent>
        {vegaAssociatedBalance ? (
          <WalletCardRow
            label={t("Associated")}
            value={vegaAssociatedBalance}
            valueSuffix={t("VEGA")}
          />
        ) : null}
        {expanded && (
          <div className="vega-wallet__expanded-container">
            <ul className="vega-wallet__key-list">
              {vegaKeys
                .filter((k) => currVegaKey && currVegaKey.pub !== k.pub)
                .map((k) => (
                  <li key={k.pub} onClick={() => changeKey(k)}>
                    {k.alias} {k.pubShort}
                  </li>
                ))}
            </ul>
            <button
              className="button-link button-link--dark"
              onClick={handleDisconnect}
              type="button"
            >
              {disconnecting ? t("awaitingDisconnect") : t("disconnect")}
            </button>
          </div>
        )}
      </WalletCardContent>
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

interface VegaWalletFormProps {
  vegaWallet: VegaWalletService;
  cancel: () => void;
}

const VegaWalletForm = ({ vegaWallet, cancel }: VegaWalletFormProps) => {
  const staking = useVegaStaking();
  const { t } = useTranslation();
  const {
    appDispatch,
    appState: { address },
  } = useAppState();
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
  }

  const required = t("required");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="vega-wallet__form">
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
      <div className="vega-wallet__form-buttons">
        <button
          data-testid="wallet-login"
          type="submit"
          disabled={loading}
          className="vega-wallet__form-submit"
        >
          {loading ? t("vegaWalletConnecting") : t("vegaWalletConnect")}
        </button>
        <button
          onClick={cancel}
          type="button"
          className="vega-wallet__form-cancel"
        >
          {t("Cancel")}
        </button>
      </div>
    </form>
  );
};
