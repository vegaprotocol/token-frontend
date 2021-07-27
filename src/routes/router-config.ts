import React from "react";

const LazyTranches = React.lazy(() => import("./tranches"));
const LazyClaim = React.lazy(() => import("./claim"));
const LazyRedemption = React.lazy(() => import("./redemption"));

const routerConfig = [
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
