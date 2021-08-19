import React from "react";
import { FormGroup, Intent, Overlay } from "@blueprintjs/core";
import "./vega-wallet.scss";
import { useForm } from "react-hook-form";
import {
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";

export const VegaWallet = () => {
  const { appState, appDispatch } = useAppState();
  console.log(appState.currVegaKey);

  React.useEffect(() => {
    async function run(url: string, token: string) {
      try {
        const keysRes = await fetch(`${url}/keys`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const keysJson = await keysRes.json();
        appDispatch({ type: "VEGA_WALLET_CONNECT", keys: keysJson.keys });
      } catch (err) {
        console.log(err);
      }
    }

    const token = localStorage.getItem("vega_wallet_token");
    const url = localStorage.getItem("vega_wallet_url");

    if (url && token) {
      run(url, token);
    }
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
  const [expanded, setExpanded] = React.useState(false);
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
  const { appDispatch } = useAppState();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      url: "http://localhost:1789/api/v1",
    },
  });

  async function onSubmit(fields: FormFields) {
    setLoading(true);

    try {
      const tokenRes = await fetch(`${fields.url}/auth/token`, {
        method: "post",
        body: JSON.stringify({
          wallet: fields.wallet,
          passphrase: fields.passphrase,
        }),
      });
      const tokenJson = await tokenRes.json();

      if (tokenJson.hasOwnProperty("token")) {
        localStorage.setItem("vega_wallet_token", tokenJson.token);
      } else {
        throw new Error("Get token failed");
      }

      // get keys
      const keysRes = await fetch(`${fields.url}/keys`, {
        headers: { authorization: `Bearer ${tokenJson.token}` },
      });
      const keysJson = await keysRes.json();
      localStorage.setItem("vega_wallet_url", fields.url);
      appDispatch({ type: "VEGA_WALLET_CONNECT", keys: keysJson.keys });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
