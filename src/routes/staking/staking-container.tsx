import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { EthWrongChainPrompt } from "../../components/eth-connect-prompt/eth-wrong-chain-prompt";
import { TrancheContainer } from "../../components/tranche-container";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";

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
    appState: { appChainId, chainId, currVegaKey },
    appDispatch,
  } = useAppState();
  const { address } = useEthUser();

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

  return (
    <TrancheContainer address={address}>
      {() => children({ address, currVegaKey })}
    </TrancheContainer>
  );
};
