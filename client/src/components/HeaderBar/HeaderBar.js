import React, { Component } from 'react';
import './HeaderBar.css';
import LeftDrawer from '../LeftDrawer/LeftDrawer';

const pages = [
  { label: 'Course Registration', path: '/courseregistration' },
  { label: 'Course Suggestions', path: '/home' },
  { label: 'Curriculum', path: '/curriculumdisplay' },
];

export class HeaderBar extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <header className="HeaderBar">
      <nav className="HeaderBar_navigation">
        <div>
          <LeftDrawer pages={pages} email={this.props.email} />
        </div>
        <div />
        <div className="HeaderBar_project_name">
          <a href="/">{this.props.email}</a>
        </div>
        <div className="spaceFiller" />
        <div className="HeaderBar_logo" />
      </nav>
    </header>
    );
  }
}

export default HeaderBar;
