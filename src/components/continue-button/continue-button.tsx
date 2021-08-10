import React from "react";
export interface ContinueButtonProps {
  onSubmit: () => void;
  continueText: string;
}

export const ContinueButton = ({
  onSubmit,
  continueText,
}: ContinueButtonProps) => {
  return (
    <div className="continue-button__container">
      <button type="submit" onClick={onSubmit} className="fill">
        {continueText}
      </button>
    </div>
  );
};
