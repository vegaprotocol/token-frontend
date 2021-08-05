import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const LockedBanner = () => {
  const { t } = useTranslation();
  const {
    appState: { contractAddresses },
  } = useAppState();
  return (
    <Callout
      title={t(
        "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
      )}
    >
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
