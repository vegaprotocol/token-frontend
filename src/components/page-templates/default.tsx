import React from "react";
import { Heading } from "../heading";
import { Notice } from "../notice";

export interface DefaultTemplateProps {
  children: React.ReactNode;
  title: string;
}

export function DefaultTemplate({ children, title }: DefaultTemplateProps) {
  return (
    <div className="app-wrapper">
      <Heading title={title} />
      <main>{children}</main>
      <footer>
        <Notice />
      </footer>
    </div>
  );
}
