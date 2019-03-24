import React from 'react';
import './HeaderBar.css';
import LeftDrawer from '../LeftDrawer/LeftDrawer';

const pages = [
  { label: 'Course Registration', path: '/courseRegistration' },
  { label: 'Course Suggestions', path: '/courseSuggestions' },
  { label: 'Curriculum', path: '/curriculumDisplay' },
];
const HeaderBar = props => (
  <header className="HeaderBar">
    <nav className="HeaderBar_navigation">
      <div>
        <LeftDrawer pages={pages} email={props.email} />
      </div>
      <div />
      <div className="HeaderBar_project_name">
        <a>{props.email}</a>
      </div>
      <div className="spaceFiller" />
      <div className="HeaderBar_logo" />
    </nav>
  </header>
);

export default HeaderBar;
