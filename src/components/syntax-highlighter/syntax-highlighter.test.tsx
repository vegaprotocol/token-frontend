import { render, screen } from "@testing-library/react";

import { SyntaxHighlighter } from "./syntax-highlighter";

it("Renders test id", () => {
  const data = {};
  render(<SyntaxHighlighter data={data} />);
  expect(screen.getByTestId("syntax-highlighter")).toBeInTheDocument();
});

it("Removes __typename from data", () => {
  const data = {
    a: 1,
    __typename: "123",
  };
  render(<SyntaxHighlighter data={data} />);
  expect(screen.getByTestId("syntax-highlighter")).toHaveTextContent(
    `{ "a": 1 }`
  );
});
