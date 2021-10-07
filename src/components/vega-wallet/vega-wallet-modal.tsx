import { Overlay } from "@blueprintjs/core";
import { Trans, useTranslation } from "react-i18next";
import { Links } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Modal } from "../modal";
import { VegaWalletForm } from "./vega-wallet-form";

export const VegaWalletModal = () => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();
  return (
    <Overlay
      isOpen={appState.vegaWalletOverlay}
      onClose={() =>
        appDispatch({
          type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
          isOpen: false,
        })
      }
      transitionDuration={0}
    >
      <div className="modal">
        <Modal>
          <h2>{t("connectVegaWallet")}</h2>
          <p>
            <Trans
              i18nKey="vegaWalletRunning"
              components={{
                walletLink: (
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    href={Links.WALLET_RELEASES}
                    target="_blank"
                    rel="nofollow noreferrer"
                  />
                ),
              }}
            />
          </p>
          <VegaWalletForm
            onConnect={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: false,
              })
            }
          />
        </Modal>
      </div>
    </Overlay>
  );
};
