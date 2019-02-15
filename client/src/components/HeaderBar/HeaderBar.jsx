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
      <div className="HeaderBar_logo">
        <a href="/">James McGill</a>
      </div>
      <div className="spaceFiller" />
      <div className="HeaderBar_navigation-tabs">
        <ul>
          <li>
            <a href="/Home">Home</a>
          </li>
          <li>
            <a href="/Courses_registration">Courses Registration</a>
          </li>
          <li>
            <a href="/Blep">Blep</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

export default HeaderBar;
