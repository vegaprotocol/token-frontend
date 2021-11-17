import { ButtonHTMLAttributes } from "react";
import "./stateful-button.scss";

export const StatefulButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const classProp = props.className || "";
  return <button {...props} className={` fill ${classProp}`} />;
};
