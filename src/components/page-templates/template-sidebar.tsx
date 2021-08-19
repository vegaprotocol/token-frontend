import "./template-sidebar.scss";
import React from "react";
import { Heading } from "../heading";
import { Notice } from "../notice";
import { Drawer } from "@blueprintjs/core";

export interface TemplateSidebarProps {
  title: string;
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function TemplateSidebar({
  title,
  children,
  sidebar,
}: TemplateSidebarProps) {
  const isDesktop = window.innerWidth > 960;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="template-sidebar">
      <Heading title={title} />
      <main>{children}</main>
      {isDesktop ? (
        <aside>
          {/* TODO: whats the best way to do the below, appeasing typescript
         // @ts-ignore */}
          {sidebar.map((Component, i) => (
            <section key={i}>{Component}</section>
          ))}
        </aside>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{ position: "fixed", top: 20, right: 20 }}
          >
            View keys
          </button>
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            size="80%"
          >
            <div>
              {/* @ts-ignore */}
              {sidebar.map((Component, i) => (
                <section key={i}>{Component}</section>
              ))}
            </div>
          </Drawer>
        </>
      )}
      <footer>
        <Notice />
      </footer>
    </div>
  );
}
