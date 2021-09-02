import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { EthWrongChainPrompt } from "../../components/eth-connect-prompt/eth-wrong-chain-prompt";
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
  const {
    appState: { appChainId, chainId },
    appDispatch,
  } = useAppState();
  const { address } = useEthUser();
  const { currVegaKey } = useVegaUser();

  if (appChainId !== chainId) {
    return <EthWrongChainPrompt />;
  }

  if (!address) {
    return <EthConnectPrompt />;
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

  return children({ address, currVegaKey });
};
