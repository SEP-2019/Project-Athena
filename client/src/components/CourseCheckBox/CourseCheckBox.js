import React, { Component } from 'react';
import './CourseCheckBox.css';

class CourseCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div htmlFor={this.props.course_code} className="course_checkbox">
          <label className="checkbox_label">{this.props.course_code}</label>
          <input
            id={this.props.course_code}
            type="checkbox"
            name={this.props.course_code}
            checked={this.props.checked}
            onChange={this.props.handleChange}
          />
          <label className="spacer_label" />
          <label
            htmlFor={this.props.course_code}
            className="custom_large_checkbox"
          />
        </div>
      </div>
    );
  }
}

export default CourseCheckBox;
