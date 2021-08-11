import "./form-group.scss";
import React from "react";
import { Colors } from "../../colors";

export const FormGroup = ({
  children,
  label,
  labelFor,
  errorText,
}: {
  children: React.ReactNode;
  label: string;
  labelFor: string;
  errorText?: string;
}) => {
  return (
    <div className="form-group">
      <label htmlFor={labelFor}>{label}</label>
      <div>{children}</div>
      {errorText && (
        <div className="form-group__error" style={{ color: Colors.RED }}>
          {errorText}
        </div>
      )}
    </div>
  );
};
