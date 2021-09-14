import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaUser } from "../../hooks/use-vega-user";

export const StakingContainer = ({
  children,
}: {
  children: (data: {
    address: string;
    currVegaKey: VegaKeyExtended;
  }) => React.ReactElement;
}) => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const { ethAddress } = useEthUser();
  const { currVegaKey } = useVegaUser();

  if (!ethAddress) {
    return (
      <EthConnectPrompt>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
      </EthConnectPrompt>
    );
  }

  if (!currVegaKey) {
    return (
      <>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
        <button
          onClick={() =>
            appDispatch({
              type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
              isOpen: true,
            })
          }
        >
          {t("connectVegaWallet")}
        </button>
      </>
    );
  }

  return children({ address: ethAddress, currVegaKey });
};
