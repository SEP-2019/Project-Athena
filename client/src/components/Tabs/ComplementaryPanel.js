import React, { Component } from 'react';
import InterestCheckBoxList from '../Lists/InterestCheckBoxList';
import PropTypes from 'prop-types';
import { SnackbarProvider, withSnackbar } from 'notistack';
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
          Display Courses in appropriate interest section
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
