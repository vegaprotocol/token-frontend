import { useTranslation } from "react-i18next";

export const LockedBanner = () => {
  const { t } = useTranslation();
  /* TODO get the address for the locked vega contract */
  const lockedContractAddress = "0xufb8y3bv8wur4uhr";
  return (
    <div style={{ padding: 20, border: "1px solid white" }}>
      <p>
        {t(
          "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
        )}
      </p>
      <p>
        {t(
          "Add the Vega vesting token to your wallet to track how much you Vega you have in the vesting contract."
        )}
      </p>
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
