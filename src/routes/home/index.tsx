import './home.scss'

import React from "react";
import { NavLink } from "react-router-dom";
import routerConfig from "../router-config";

const Home = () => {
  return <div>
    <h1>Home</h1>
    <nav className='nav-links'>
      {routerConfig.map(route => (
        <NavLink to={route.path}>{route.name}</NavLink>
      ))}
    </nav>
  </div>;
};

export default Home;
