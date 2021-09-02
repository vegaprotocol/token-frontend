import "./template-sidebar.scss";
import React from "react";
import { Heading } from "../heading";

export interface TemplateSidebarProps {
  title?: string;
  children: React.ReactNode;
  sidebar: React.ReactNode[];
}

export function TemplateSidebar({
  title,
  children,
  sidebar,
}: TemplateSidebarProps) {
  return (
    <div className="template-sidebar">
      <Heading title={title} />
      <main>{children}</main>
      <aside>
        {sidebar.map((Component, i) => (
          <section key={i}>{Component}</section>
        ))}
      </aside>
    </div>
  );
}
