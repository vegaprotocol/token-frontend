import "./key-value-table.scss";

import * as React from "react";

export interface KeyValueTableProps {
  title?: string;
  numerical?: boolean; // makes all values monospace
  children: React.ReactNode;
  className?: string;
}

export const KeyValueTable = ({
  title,
  numerical,
  children,
  className,
}: KeyValueTableProps) => {
  return (
    <React.Fragment>
      {title && <h3 className="key-value-table__header">{title}</h3>}
      <table
        className={`key-value-table ${className ? className : ""} ${
          numerical ? "key-value-table--numerical" : ""
        }`}
      >
        <tbody>{children}</tbody>
      </table>
    </React.Fragment>
  );
};

export interface KeyValueTableRowProps {
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}

export const KeyValueTableRow = ({
  children,
  className,
}: KeyValueTableRowProps) => {
  return (
    <tr className={`key-value-table__row ${className ? className : ""}`}>
      {children[0]}
      {children[1]}
    </tr>
  );
};
