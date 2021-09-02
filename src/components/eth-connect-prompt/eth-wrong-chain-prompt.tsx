import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { EthereumChainNames } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { Error } from "../icons";

export const EthWrongChainPrompt = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  return (
    <Callout
      intent="error"
      icon={<Error />}
      title={t("Wrong network", {
        chain: EthereumChainNames[appState.chainId!],
      })}
    >
      <p>
        {t("Desired network", {
          chain: EthereumChainNames[appState.appChainId],
        })}
      </p>
    </Callout>
  );
};
