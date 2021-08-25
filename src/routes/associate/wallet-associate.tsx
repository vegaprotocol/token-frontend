import "./wallet-associate.scss";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";

export const WalletAssociate = () => {
  const { t } = useTranslation();
  const {
    appState: { walletBalance },
  } = useAppState();
  let pageContent = null;
  // TODO
  const stakedAmount = 0;
  if (new BigNumber(walletBalance).isEqualTo("0")) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "You have no VEGA tokens in your connected wallet. You will need to buy some VEGA tokens from an exchange in order to stake using this method."
        )}
      </div>
    );
  } else if (new BigNumber(walletBalance).minus(stakedAmount).isEqualTo("0")) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "All VEGA tokens in the connected wallet is already associated with a Vega wallet/key"
        )}
      </div>
    );
  }

  return <section data-testid="wallet-associate">{pageContent}</section>;
};
