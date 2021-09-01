import "./modal.scss";
import React from "react";

interface ModalProps {
  children: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => (
  <div className="modal__content">{children}</div>
);
