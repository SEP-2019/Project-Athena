import React, { Component } from "react";
import "./CourseRegistration.css";

class CourseRegistration extends Component {
  render() {
    return (
      <div className="course-registration">
        <div className="instruction">Select the courses that you have already taken.</div>
        <div className="content">
            <div className="selection-side">
            </div>
            <div className="selected-side">
            </div>
        </div>

      </div>
    );
  }
}

export default CourseRegistration;