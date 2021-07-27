import React from "react";
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
    children: [],
    component: Home,
    exact: true,
  },
  {
    path: "/tranches",
    children: [],
    component: LazyTranches,
  },
  {
    path: "/claim",
    children: [],
    component: LazyClaim,
  },
  {
    path: "/redemption",
    children: [],
    component: LazyRedemption,
  },
];

export default routerConfig;
