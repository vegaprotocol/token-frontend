import { ButtonHTMLAttributes } from "react";
import "./stateful-button.scss";

export const StatefulButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button {...props} className={`stateful-button fill ${props.className}`} />
  );
};
