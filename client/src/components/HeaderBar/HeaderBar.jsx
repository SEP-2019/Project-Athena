import React from "react";
import "./HeaderBar.css";
// import TemporaryDrawer from "../Drawer/TemporaryDrawer";

const HeaderBar = props => (
  <header className="HeaderBar">
    <nav className="HeaderBar_navigation">
      {/* <div>
        <TemporaryDrawer />
      </div> */}
      <div />
      <div className="HeaderBar_project_name">
        <a href="/">James McGill</a>
      </div>
      <div className="spaceFiller" />
      <div className="HeaderBar_logo" />
    </nav>
  </header>
);

export default HeaderBar;
