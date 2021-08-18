import "./template-sidebar.scss";
import React from "react";
import { Heading } from "../heading";
import { Notice } from "../notice";

export interface TemplateSidebarProps {
  title: string;
  children: React.ReactNode;
  sidebar: React.ReactChildren;
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
        {/* TODO: whats the best way to do the below, appeasing typescript
         // @ts-ignore */}
        {sidebar.map((Component, i) => (
          <section key={i}>{<Component />}</section>
        ))}
      </aside>
      <footer>
        <Notice />
      </footer>
    </div>
  );
}
