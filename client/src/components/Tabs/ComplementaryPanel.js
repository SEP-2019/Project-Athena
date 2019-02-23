import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider, withSnackbar } from 'notistack';

import InterestCheckBoxList from '../Lists/InterestCheckBoxList';
import CourseSuggestionList from '../Lists/CourseSuggestionList';
import './ComplementaryPanel.css';

const interests = [
  { name: 'Robotics', checked: false },
  { name: 'Machine Learning', checked: false },
  { name: 'Artificial Intelligence', checked: false },
  { name: 'Computer Graphics', checked: false },
  { name: 'Architecture', checked: false },
  { name: 'Quality Assurance', checked: false },
  { name: 'Research & Development', checked: false },
  { name: 'COMP 360', checked: false },
  { name: 'Robotics2', checked: false },
  { name: 'Machine Learning2', checked: false },
  { name: 'Artificial Intelligence2', checked: false },
  { name: 'Computer Graphics2', checked: false },
  { name: 'Architecture2', checked: false },
  { name: 'Quality Assurance2', checked: false },
  { name: 'Research & Development2', checked: false },
  { name: 'COMP 3602', checked: false },
];

const InterestCheckBoxListWithSnackBar = withSnackbar(InterestCheckBoxList);

class ComplementaryPanel extends Component {
  state = {};
  render() {
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="container">
          <SnackbarProvider maxSnack={3}>
            <InterestCheckBoxListWithSnackBar interests={interests} />
          </SnackbarProvider>
        </div>
        <div className="spacer" />
        <h4 className="list_courses">
          Display Suggested Courses in appropriate interest section
          <CourseSuggestionList />
        </h4>
        <div className="spacer" />
      </div>
    );
  }
}

InterestCheckBoxList.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default ComplementaryPanel;
