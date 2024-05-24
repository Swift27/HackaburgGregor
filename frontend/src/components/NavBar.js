import React from "react";
import "../styles/navbar.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

function NavBar({ current_ssid }) {
  return (
    <div className="navbar">
      <div className="navbar-left-section">
        <h1 className="title">SCAM</h1>
        <ul className="navbar-links">
          <CustomLink to="/settings">Settings</CustomLink>
          <CustomLink to="/history">History</CustomLink>
        </ul>
      </div>
      <div className="navbar-right-section">
        <p>
          Verbundenes Netzwerk: {current_ssid !== "" ? current_ssid : "Keins"}
        </p>
      </div>
    </div>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default NavBar;
