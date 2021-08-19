import "./eth-wallet.scss";
import { useTranslation } from "react-i18next";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { truncateMiddle } from "../../lib/truncate-middle";

export const EthWallet = () => {
  const { appState } = useAppState();

  return (
    <div className="eth-wallet">
      {appState.providerStatus === ProviderStatus.Ready && <ConnectedKey />}
    </div>
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const connect = useConnect();
  const { appState } = useAppState();
  const { connecting, address, error, balanceFormatted } = appState;

  if (error) {
    return <div>{t("Something went wrong")}</div>;
  }

  if (connecting) {
    return <div>{t("Awaiting action in wallet...")}</div>;
  }

  if (!address) {
    return (
      <button type="button" onClick={connect} className="eth-wallet__connect">
        {t("Connect")}
      </button>
    );
  }

  return (
    <>
      <div className="vega-wallet__key">
        <span style={{ textTransform: "uppercase" }}>Ethereum key</span>
        <span className="vega-wallet__curr-key">{truncateMiddle(address)}</span>
      </div>
      <div className="eth-wallet__row">
        <span>{t("Locked")}</span>
        <span>
          {balanceFormatted} {t("VEGA")}
        </span>
      </div>
      <div className="eth-wallet__row">
        <span>{t("Unlocked")}</span>
        <span>
          {/* TODO: get this valie */}
          0.00
        </span>
      </div>
    </>
  );
};

// export const NetworkSwitcher = () => {
//   const {
//     appState: { appChainId },
//     appDispatch,
//   } = useAppState();
//   return (
//     <select
//       value={appChainId}
//       style={{ padding: 4 }}
//       onChange={(e) => {
//         appDispatch({
//           type: "APP_CHAIN_CHANGED",
//           newChainId: e.target.value as EthereumChainId,
//         });
//       }}
//     >
//       {Object.entries(EthereumChainIds).map(([name, val]) => (
//         <option
//           key={val}
//           value={val}
//           disabled={
//             ![EthereumChainIds.Ropsten, EthereumChainIds.Mainnet].includes(val)
//           }
//         >
//           {name}
//         </option>
//       ))}
//     </select>
//   );
// };
