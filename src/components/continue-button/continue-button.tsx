import React from "react";

import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";

export interface ContinueButtonProps {
  isValid: boolean;
  loading: boolean;
  onSubmit: () => void;
  continueText: string;
  errorText: string;
}

export const ContinueButton = ({
  isValid,
  loading,
  onSubmit,
  continueText,
  errorText,
}: ContinueButtonProps) => {
  const [showError, setShowError] = React.useState(false);
  const { t } = useTranslation();
  const disabled = !isValid || loading;

  const onContinue = () => {
    setShowError(disabled);
    if (!disabled) {
      onSubmit();
    }
  };

  return (
    <div className="continue-button__container">
      <button onClick={onContinue} className={disabled ? "disabled" : ""}>
        {loading ? t("Loading") : continueText}
      </button>
      {showError && !isValid ? (
        <p style={{ color: Colors.RED }}>{errorText}</p>
      ) : null}
    </div>
  );
};
