import { useTranslation } from "react-i18next";
import {
  useAppState,
  VegaKeyExtended,
  VegaWalletStatus,
} from "../../contexts/app-state/app-state-context";
import { Callout } from "../callout";
import { Error } from "../icons";

interface VegaWalletContainerProps {
  children: (data: { vegaKey: VegaKeyExtended }) => JSX.Element;
}

export const VegaWalletContainer = ({ children }: VegaWalletContainerProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  if (appState.vegaWalletStatus === VegaWalletStatus.Pending) {
    return (
      <Callout intent="warn" title="">
        <p>{t("Checking Vega wallet status")}...</p>
      </Callout>
    );
  }

  if (appState.vegaWalletStatus === VegaWalletStatus.None) {
    return (
      <Callout intent="error" icon={<Error />} title="Vega wallet not running">
        <p>{t("noService")}</p>
      </Callout>
    );
  }

  if (!appState.currVegaKey) {
    return (
      <Callout intent="error" icon={<Error />}>
        <p>{t("connectVegaWallet")}</p>
      </Callout>
    );
  }

  return children({ vegaKey: appState.currVegaKey });
};
