import React from "react";
import NotFound from "./not-found";
import Home from "./home";
import NotPermitted from "./not-permitted";

export const Routes = {
  HOME: "/",
  ASSOCIATE: "/associate",
  TRANCHES: "/tranches",
  CLAIM: "/claim",
  STAKING: "/staking",
  REDEMPTION: "/redemption",
  NOT_PERMITTED: "/not-permitted",
  NOT_FOUND: "/not-found",
};

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
const LazyStaking = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-staking", webpackPrefetch: true */ "./staking"
    )
);
const LazyAssociate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "route-associate", webpackPrefetch: true */ "./associate"
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
    path: Routes.TRANCHES,
    name: "Tranches",
    component: LazyTranches,
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
    path: Routes.REDEMPTION,
    name: "Redemption",
    component: LazyRedemption,
  },
  {
    path: Routes.ASSOCIATE,
    name: "Associate",
    children: [],
    component: LazyAssociate,
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
