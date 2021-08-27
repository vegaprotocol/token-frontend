import "./template-default.scss";
import React from "react";
import { Heading } from "../heading";

export interface TemplateDefaultProps {
  title: string;
  children: React.ReactNode;
}

export function TemplateDefault({ title, children }: TemplateDefaultProps) {
  return (
    <div className="template-default">
      <div className="template-default__wrapper">
        <Heading title={title} />
        <main>{children}</main>
      </div>
    </div>
  );
}
