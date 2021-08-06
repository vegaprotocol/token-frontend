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

  const buttonClasses = [disabled ? "disabled" : "", "fill"].join(" ");

  return (
    <div className="continue-button__container">
      <button type="submit" onClick={onContinue} className={buttonClasses}>
        {loading ? t("Loading") : continueText}
      </button>
      {showError && !isValid ? (
        <div style={{ fontSize: 14, color: Colors.RED, marginTop: 8 }}>
          {errorText}
        </div>
      ) : null}
    </div>
  );
};
