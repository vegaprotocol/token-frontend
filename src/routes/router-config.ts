import React from "react";
import NotFound from "./not-found";
import Home from "./home";
import NotPermitted from "./not-permitted";

export const Routes = {
  HOME: "/",
  CLAIM: "/claim",
  STAKING: "/staking",
  GOVERNANCE: "/governance",
  VESTING: "/vesting",
  NOT_PERMITTED: "/not-permitted",
  NOT_FOUND: "/not-found",
};

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
const LazyStaking = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-staking", webpackPrefetch: true */ "./staking"
    )
);
const LazyGovernance = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-governance", webpackPrefetch: true */ "./governance"
    )
);

const routerConfig = [
  {
    path: Routes.HOME,
    name: "Home",
    // Not lazy as loaded when a user first hits the site
    component: Home,
    exact: true,
  },
  {
    path: Routes.CLAIM,
    name: "Claim",
    component: LazyClaim,
  },
  {
    path: Routes.STAKING,
    name: "Staking",
    component: LazyStaking,
  },
  {
    path: Routes.VESTING,
    name: "Vesting",
    component: LazyRedemption,
  },
  {
    path: Routes.GOVERNANCE,
    name: "Governance",
    component: LazyGovernance,
  },
  {
    path: Routes.NOT_PERMITTED,
    name: "Not permitted",
    // Not lazy as loaded when a user first hits the site
    component: NotPermitted,
  },
  {
    name: "NotFound",
    // Not lazy as loaded when a user first hits the site
    component: NotFound,
  },
];

export default routerConfig;
