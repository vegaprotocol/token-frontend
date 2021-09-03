import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { useAppState } from "../../contexts/app-state/app-state-context";
export const CodeUsed = ({ address }: { address: string | null }) => {
  const { t } = useTranslation();
  const {
    appState: { contractAddresses },
  } = useAppState();
  return (
    <Callout intent="warn" icon={<Error />} title={t("codeUsed")}>
      <p>{t("codeUsedText")}</p>
      <h4>
        {t(
          "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
        )}
      </h4>
      <p>
        {t(
          "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",
          {
            address: contractAddresses.lockedAddress,
          }
        )}
      </p>
    </Callout>
  );
};
