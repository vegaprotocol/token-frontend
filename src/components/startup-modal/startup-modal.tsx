import React from "react";
import { Checkbox, Overlay } from "@blueprintjs/core";
import { Trans, useTranslation } from "react-i18next";
import { Links } from "../../config";
import { useLocalStorage } from "../../hooks/use-local-storage";
import { Modal } from "../modal";

const MODAL_CLOSED_KEY = "vega_modal_closed";

export const StartupModal = () => {
  const { t } = useTranslation();
  const [storeDismiss, setStoreDismiss] = React.useState(false);
  const [storedIsOpen, setStoredIsOpen] = useLocalStorage(
    MODAL_CLOSED_KEY,
    true
  );
  const [isOpen, setIsOpen] = React.useState(storedIsOpen);

  return (
    <Overlay
      isOpen={isOpen}
      transitionDuration={0}
      onClose={() => setIsOpen(false)}
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
          <p>
            <Checkbox
              checked={storeDismiss}
              label={t("startupModalDimissCheckboxLabel")}
              onChange={(e) => {
                setStoreDismiss((x) => !x);
              }}
            />
          </p>
          <button
            onClick={() => {
              if (storeDismiss) {
                setStoredIsOpen(false);
              }
              setIsOpen(false);
            }}
          >
            {t("dismiss")}
          </button>
        </Modal>
      </div>
    </Overlay>
  );
};
