import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  WalletCard,
  WalletCardContent,
  WalletCardHeader,
  WalletCardRow,
} from "../wallet-card";
import { Colors } from "../../colors";
import { useEthUser } from "../../hooks/use-eth-user";

export const EthWallet = () => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const { address } = useEthUser();

  return (
    <WalletCard>
      <WalletCardHeader>
        <span>{t("ethereumKey")}</span>
        {address && (
          <>
            <span className="vega-wallet__curr-key">
              {truncateMiddle(address)}
            </span>
          </>
        )}
      </WalletCardHeader>
      <WalletCardContent>
        {address ? (
          <ConnectedKey />
        ) : (
          <button
            type="button"
            className="button-link"
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
                isOpen: true,
              })
            }
            data-testid="connect"
          >
            {t("Connect")}
          </button>
        )}
      </WalletCardContent>
    </WalletCard>
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { lien, walletBalance, totalLockedBalance, totalVestedBalance } =
    appState;

  return (
    <>
      <WalletCardRow label={t("In wallet")} dark={true} />
      <WalletCardRow
        label={t("Not staked")}
        value={walletBalance}
        valueSuffix={t("VEGA")}
      />
      <hr style={{ borderColor: Colors.BLACK, borderTop: 1 }} />
      <WalletCardRow label={t("VESTING VEGA TOKENS")} dark={true} />
      <WalletCardRow
        label={t("Locked")}
        value={totalLockedBalance}
        valueSuffix={t("VEGA")}
      />
      <WalletCardRow
        label={t("Unlocked")}
        value={totalVestedBalance}
        valueSuffix={t("VEGA")}
      />
      <hr style={{ borderStyle: "dashed", color: Colors.TEXT }} />
      <WalletCardRow
        label={t("Associated")}
        value={lien}
        valueSuffix={t("VEGA")}
      />
    </>
  );
};
