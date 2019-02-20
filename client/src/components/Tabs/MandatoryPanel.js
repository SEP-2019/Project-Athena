import React, { Component } from 'react';
import './MandatoryPanel.css';

const courses = [
  { name: 'Robotics', checked: false },
  { name: 'Machine Learning', checked: false },
  { name: 'Artificial Intelligence', checked: false },
  { name: 'Computer Graphics', checked: false },
  { name: 'Architecture', checked: false },
  { name: 'Quality Assurance', checked: false },
  { name: 'Research & Development', checked: false },
  { name: 'COMP 360', checked: false },
];
class MandatoryPanel extends Component {
  state = {};
  render() {
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="container">Hello World!</div>
        <div className="spacer" />
        <h4 className="list_courses">
          Display Courses in appropriate interest section
        </h4>
        <div className="spacer" />
      </div>
    );
  }
}

export default MandatoryPanel;

{
  /* <div className="page">
              <div className="course-registration">
                <div className="instruction">
                  Select the courses that you have already taken.
                </div>
                <div className="content">
                  <div className="selection-side" />
                  <div className="selected-side" />
                </div>
              </div>
            </div> */
}
