import "./template-sidebar.scss";
import React from "react";
import { Heading } from "../heading";
import { Notice } from "../notice";
import { Drawer } from "@blueprintjs/core";
import debounce from "lodash/debounce";

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
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isDesktop = windowWidth > 960;

  React.useEffect(() => {
    const handleResizeDebounced = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResizeDebounced);

    return () => {
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, []);

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
            <div className="template-sidebar__drawer">
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
