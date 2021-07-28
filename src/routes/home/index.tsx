import "./home.scss";

import React from "react";
import { /* NavLink, */ Redirect } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import routerConfig from "../router-config";

const Home = () => {
  // const { t } = useTranslation();

  return <Redirect to="/tranches" />;
  // return (
  //   <div>
  //     <h1>{t("Home")}</h1>
  //     <nav className="nav-links">
  //       {routerConfig.map((route) => (
  //         <NavLink key={route.name} to={route.path}>
  //           {route.name}
  //         </NavLink>
  //       ))}
  //     </nav>
  //   </div>
  // );
};

export default Home;
