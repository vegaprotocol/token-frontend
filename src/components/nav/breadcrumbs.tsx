import "./breadcrumbs.scss";

import { Link, useRouteMatch } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { truncateMiddle } from "../../lib/truncate-middle";
import React from "react";

export const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs([
    // need to explicitly specify truncate: false for staking routes otherwise they
    // they will match /staking/:nodeid
    {
      path: "/staking/associate",
      props: { truncate: false },
    },
    {
      path: "/staking/disassociate",
      props: { truncate: false },
    },
    {
      path: "/staking/:node",
      props: { truncate: true },
    },
  ]);
  const isClaim = useRouteMatch("/claim");
  return !isClaim && breadcrumbs.length > 1 ? (
    <div className="breadcrumbs">
      {breadcrumbs.map(
        (
          {
            breadcrumb,
            match,
            // @ts-ignore // seemingly no way of typing additional breadcrumb props
            truncate,
          },
          index
        ) => {
          return (
            <div key={`${index}-container`} data-testid="breadcrumb">
              <Link to={match.url} key={`${index}-link`}>
                {truncate
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
          );
        }
      )}
    </div>
  ) : null;
};
