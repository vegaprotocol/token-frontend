import { Overlay } from "@blueprintjs/core";
import { Trans, useTranslation } from "react-i18next";
import { Links } from "../../config";
import { useLocalStorage } from "../../hooks/use-local-storage";
import { Modal } from "../modal";

const MODAL_CLOSED_KEY = "vega_modal_closed";

export const StartupModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useLocalStorage(MODAL_CLOSED_KEY, true);

  return (
    <Overlay
      isOpen={isOpen}
      transitionDuration={0}
      // Make user explicitly click button to accept to not show message again
      canOutsideClickClose={false}
    >
      <div className="modal">
        <Modal>
          <h2>{t("startupModalTitle")}</h2>
          <p>
            <Trans
              i18nKey="startupModalPara"
              components={{
                // eslint-disable-next-line
                knownIssuesLink: <a href={Links.KNOWN_ISSUES} />,
              }}
            />
          </p>
          <button onClick={() => setIsOpen(false)}>
            {t("startupModalButton")}
          </button>
        </Modal>
      </div>
    </Overlay>
  );
};
