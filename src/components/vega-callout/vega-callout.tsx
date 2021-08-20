import { Callout } from "@blueprintjs/core";
import * as React from "react";

const style: React.CSSProperties = {
  fontSize: 12,
  borderRadius: 0,
  background: "#2a2a2a",
  marginBottom: 10,
};

export function VegaCallout({ children }: React.PropsWithChildren<{}>) {
  return (
    <Callout data-testid="vega-callout" style={style}>
      {children}
    </Callout>
  );
}
