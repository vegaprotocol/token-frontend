import "./template-default.scss";
import React from "react";
import { Heading } from "../heading";

export interface TemplateDefaultProps {
  title?: string;
  children: React.ReactNode;
}

export function TemplateDefault({ title, children }: TemplateDefaultProps) {
  return (
    <div className="template-default">
      <Heading title={title} />
      <main>{children}</main>
    </div>
  );
}
