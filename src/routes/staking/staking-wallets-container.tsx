import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaUser } from "../../hooks/use-vega-user";

export const StakingWalletsContainer = ({
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
            "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
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
            "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
          )}
        </p>
        <button
          onClick={() =>
            appDispatch({
              type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
              isOpen: true,
            })
          }
          className="fill"
        >
          {t("connectVegaWallet")}
        </button>
      </>
    );
  }

  return children({ address: ethAddress, currVegaKey });
};
