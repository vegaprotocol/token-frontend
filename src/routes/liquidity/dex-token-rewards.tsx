import { useTranslation } from "react-i18next";

/**
 * Contains a mapping of token addresses to multipliers.
 * This will be used to show that, for instance, for every
 * 1 0x12345, a user will be rewarded with 2 VEGA tokens.
 */
// eslint-disable-next-line
const TOKEN_MULTIPLIER: Record<string, number> = {
  '0x0': 2
}

/**
 * Maps over a list of all tokens in the user's wallet. If
 * there is a record in TOKEN_MULTIPLIER{token_address} we
 * show it below and multiply the user's balance by the
 * multiplier. The user will be rewarded with this when the
 * contract to do so is deployed.
 *
 * This will be a <KeyValueTable /> where:
 * - The key is the token name
 * - The value is the mutiplier X token balance
 *
 * @param address
 * @constructor
 */
export const DexTokenRewards = ({
  address
}: {
  address: string
}) => {
  const { t } = useTranslation();

  return (
    <section className="dex-token-rewards">
      <strong data-testid="connected-vega-key-label">
        {t("Connected Vega key")}
      </strong>
      <p data-testid="connected-vega-key">{address}</p>
    </section>
  );
};
