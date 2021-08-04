import React from "react";
import NotFound from "./not-found";
import Home from "./home";

const LazyTranches = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-tranches", webpackPrefetch: true */ "./tranches"
    )
);
const LazyClaim = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-claim", webpackPrefetch: true */ "./claim"
    )
);
const LazyRedemption = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-redemption", webpackPrefetch: true */ "./redemption"
    )
);
const routerConfig = [
  {
    path: "/",
    name: "Home",
    children: [],
    // Not lazy as loaded when a user first hits the site
    component: Home,
    exact: true,
  },
  {
    path: "/tranches",
    name: "Tranches",
    children: [],
    component: LazyTranches,
  },
  {
    path: "/claim",
    name: "Claim",
    children: [],
    component: LazyClaim,
  },
  {
    path: "/redemption",
    name: "Redemption",
    children: [],
    component: LazyRedemption,
  },
  {
    path: "/not-found",
    name: "NotFound",
    children: [],
    component: NotFound,
  },
];

export default routerConfig;
