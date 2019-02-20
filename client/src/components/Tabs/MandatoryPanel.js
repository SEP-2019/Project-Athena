import React, { Component } from 'react';

import './MandatoryPanel.css';

class MandatoryPanel extends Component {
  state = {};
  render() {
    return (
      <div className="tab_content">
        <div className="spacer" />
        <h4 className="list_courses">
          Display all remaining Mandatory Courses
        </h4>
        <div className="spacer" />
      </div>
    );
  }
}

export default MandatoryPanel;
