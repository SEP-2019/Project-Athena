import React, { Component } from 'react';
import InterestCheckBoxList from '../Lists/InterestCheckBoxList';
import './CourseSuggestionPanel.css';

const interests = [
  { name: 'Robotics', checked: false },
  { name: 'Machine Learning', checked: false },
  { name: 'Artificial Intelligence', checked: false },
  { name: 'Computer Graphics', checked: false },
];

class CourseSuggestionPanel extends Component {
  state = {};
  render() {
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="container">
          <InterestCheckBoxList interests={interests} />
        </div>
        <div className="spacer" />
        <h4 className="list_courses">
          Display Courses in appropriate interest section
        </h4>
        <div className="spacer" />
      </div>
    );
  }
}

export default CourseSuggestionPanel;
