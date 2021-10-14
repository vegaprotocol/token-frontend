import "./breadcrumbs.scss";

import { Link, useRouteMatch } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { truncateMiddle } from "../../lib/truncate-middle";
import React from "react";

export const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  const isClaim = useRouteMatch("/claim");
  console.log(breadcrumbs);
  return !isClaim && breadcrumbs.length > 1 ? (
    <div className="breadcrumbs">
      {breadcrumbs.map(({ breadcrumb, match }, index) => (
        <div key={`${index}-container`} data-testid="breadcrumb">
          <Link to={match.url} key={`${index}-link`}>
            {isStakeNodePage(match.url)
              ? React.cloneElement(breadcrumb as React.ReactElement, {
                  children: truncateMiddle(
                    (breadcrumb as React.ReactElement).props.children
                  ),
                })
              : breadcrumb}
          </Link>
          <span key={`${index}-spacer`} className="breadcrumbs__spacer">
            {index !== breadcrumbs.length - 1 && ">"}
          </span>
        </div>
      ))}
    </div>
  ) : null;
};

function isStakeNodePage(url: string) {
  return /\/staking\/[a-zA-Z0-9]+$/.test(url);
}
