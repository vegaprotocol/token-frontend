import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { Addresses } from "../../lib/web3-utils";

export const LockedBanner = () => {
  const { t } = useTranslation();
  const {
    appState: { appChainId },
  } = useAppState();
  const lockedContractAddress = Addresses[appChainId].lockedAddress;
  return (
    <div style={{ padding: 20, border: "1px solid white" }}>
      <h3>
        {t(
          "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
        )}
      </h3>
      <p>
        {t(
          "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",
          {
            address: lockedContractAddress,
          }
        )}
      </p>
    </div>
  );
};
