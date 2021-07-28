import React from "react";
import { useTranslation } from "react-i18next";

export const ConnectedClaim = () => {
  const { t } = useTranslation();

  const code = "0xf780...d296Cb";
  const trancheName = "tranch 2";
  const showRedeem = false; // TODO needs to be false until we build this
  const trancheEndDate = "June 5 2023";
  const unlockDate = "5th March 2022";
  const pubkey = "0x" + "0".repeat(40);
  const amount = 200;
  return (
    <section>
      <p>
        {t('claim', {
          user: pubkey ? pubkey : 'the holder',
          code,
          amount,
          trancheName,
          unlockDate,
          trancheEndDate
        })}

        {showRedeem
          ? t('showRedeem')
          : null}
      </p>
      <div
        style={{
          display: "grid",
          height: 200,
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid white",
          paddingTop: 15,
        }}
      >
        <div style={{ padding: 15, borderRight: "1px solid white" }}>
          <h1>{t("step1Title")}</h1>
          <p>{t("step1Body")}</p>
          <form>
            <fieldset>
              <select>
                <option>{t("Please select your country")}</option>
                <option>Earth</option>
              </select>
            </fieldset>
            <fieldset>
              <input type="checkbox"></input>
              <label>{t("I accept the Terms and Conditions")}</label>
            </fieldset>
            <button>{t("Continue")}</button>
          </form>
        </div>
        <div style={{ padding: 15 }}>
          <h1>{t("step2Title")}</h1>
          <p>{t("step2body")}</p>
          <p>{t("step2note")}</p>
        </div>
      </div>
    </section>
  );
};
