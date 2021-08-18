import { useTranslation } from "react-i18next";
import { Callout } from "../callout";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";

export const Connect = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const connect = useConnect();

  if (appState.connecting) {
    <Callout>
      {t("Awaiting action in Ethereum wallet (e.g. metamask)")}
    </Callout>;
  }

  if (!appState.address) {
    return (
      <>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
        <button onClick={connect}>{t("Connect to an Ethereum wallet")}</button>
      </>
    );
  }

  return <>{children}</>;
};
