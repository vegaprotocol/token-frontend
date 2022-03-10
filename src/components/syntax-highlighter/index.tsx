import React from "react";
import Highlighter from "react-syntax-highlighter";

const vegaJsonTheme = {
  hljs: {
    fontSize: "1rem",
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    display: "block",
    overflowX: "auto",
    padding: "1em",
    color: "#26ff8a",
    background: "#2C2C2C",
    border: "1px solid #696969",
  },
  "hljs-literal": {
    color: "#ff2d5e",
  },
  "hljs-number": {
    color: "#ff7a1a",
  },
  "hljs-string": {
    color: "#48aff0",
  },
};

/**
 * Remove nested __typename from response as it's useless
 */
const removeTypename = (data: object): any => {
  return Object.entries(data).reduce((prev, [key, value]) => {
    if (key === "__typename") {
      return prev;
    } else if (value && typeof value === "object") {
      prev[key] = removeTypename(value);
    } else {
      prev[key] = value;
    }
    return prev;
  }, {} as any);
};

export const SyntaxHighlighter = ({ data }: { data: object }) => {
  const filteredData = React.useMemo(() => removeTypename(data), [data]);
  return (
    <Highlighter language="json" style={vegaJsonTheme}>
      {JSON.stringify(filteredData, null, "  ")}
    </Highlighter>
  );
};
