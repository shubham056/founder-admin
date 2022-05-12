import React from 'react';
import { NavLink } from "react-router-dom";

export default function SideBar() {
  return (
    <aside className="sidebar sidenav">
      <div className="logo_box">
        <a href><img src="assets/images/logo.jpg" alt="logo" /></a>
      </div>
      <ul>
        <li className="">
          <NavLink to="/dashboard" exact={true} activeClassName="activemenu">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/investor" activeClassName="activemenu">Investors</NavLink>
        </li>
        <li>
          <NavLink to="/opportunities" activeClassName="activemenu">Opportunities</NavLink>
        </li>
        <li>
          <NavLink to="/orders" activeClassName="activemenu">Orders</NavLink>
        </li>
        <li>
          <NavLink to="/" >Profile</NavLink>
        </li>
      </ul>
    </aside>
  )
}
