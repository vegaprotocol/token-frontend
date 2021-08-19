import React from "react";
import { FormGroup, Intent, Overlay } from "@blueprintjs/core";
import "./vega-wallet.scss";
import { useForm } from "react-hook-form";
import {
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";

export const VegaWallet = () => {
  const { appState, appDispatch } = useAppState();

  React.useEffect(() => {
    async function run() {
      const isUp = await vegaWalletService.getStatus();
      if (isUp) {
        const [, keys] = await vegaWalletService.getKeys();
        appDispatch({ type: "VEGA_WALLET_INIT", keys });
      } else {
        appDispatch({ type: "VEGA_WALLET_DOWN" });
      }
    }

    run();
  }, [appDispatch]);

  return (
    <div className="vega-wallet">
      {!appState.vegaKeys ? (
        <VegaWalletNotConnected />
      ) : (
        <VegaWalletConnected
          currVegaKey={appState.currVegaKey}
          vegaKeys={appState.vegaKeys}
        />
      )}
    </div>
  );
};

const VegaWalletNotConnected = () => {
  const [overlayOpen, setOverlayOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOverlayOpen(true)}
        className="vega-wallet__connect"
        type="button"
      >
        Connect vega wallet
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
    </>
  );
};

interface VegaWalletConnectedProps {
  currVegaKey: VegaKeyExtended | null;
  vegaKeys: VegaKeyExtended[];
}

const VegaWalletConnected = ({
  currVegaKey,
  vegaKeys,
}: VegaWalletConnectedProps) => {
  const { appDispatch } = useAppState();
  const [disconnectText, setDisconnectText] = React.useState("Disconnect");
  const [expanded, setExpanded] = React.useState(false);

  async function handleDisconnect() {
    setDisconnectText("Disconnecting...");
    await vegaWalletService.revokeToken();
    appDispatch({ type: "VEGA_WALLET_DISCONNECT" });
  }

  return vegaKeys.length ? (
    <>
      <div
        onClick={() => setExpanded((curr) => !curr)}
        className="vega-wallet__key"
        title="Click to change key"
      >
        {currVegaKey ? (
          <>
            <span style={{ textTransform: "uppercase" }}>Vega key</span>
            <span className="vega-wallet__curr-key">
              {currVegaKey.alias} {currVegaKey.pubShort}
            </span>
          </>
        ) : (
          <span>No key selected</span>
        )}
      </div>
      {expanded && vegaKeys.length > 1 ? (
        <div>
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
          <div onClick={handleDisconnect}>{disconnectText}</div>
        </div>
      ) : (
        <div className="vega-wallet__row">
          <span>Staked</span>
          {/* TODO: get value */}
          <span>0.00</span>
        </div>
      )}
    </>
  ) : (
    <div>No keys</div>
  );
};

interface FormFields {
  url: string;
  wallet: string;
  passphrase: string;
}

const VegaWalletForm = () => {
  const { appState, appDispatch } = useAppState();
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
      setError("passphrase", { message: tokenErr });
      setLoading(false);
      return;
    }

    const [keysErr, keys] = await vegaWalletService.getKeys();

    if (keysErr) {
      setError("passphrase", { message: keysErr });
      setLoading(false);
      return;
    }

    appDispatch({ type: "VEGA_WALLET_INIT", keys });
    setLoading(false);
  }

  if (!appState.vegaWalletStatus) {
    return (
      <p>
        Looks like the wallet at {vegaWalletService.url} isnt running. Please
        start the service and refresh the page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label="Wallet location"
        labelFor="url"
        intent={errors.url?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.url?.message}
      >
        <input {...register("url", { required: "Required" })} type="text" />
      </FormGroup>
      <FormGroup
        label="Wallet"
        labelFor="wallet"
        intent={errors.wallet?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.wallet?.message}
      >
        <input {...register("wallet", { required: "Required" })} type="text" />
      </FormGroup>
      <FormGroup
        label="Passphrase"
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
        {loading ? "Connecting..." : "Connect"}
      </button>
    </form>
  );
};
