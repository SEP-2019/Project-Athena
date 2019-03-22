import React, { Component } from 'react';
import axios from 'axios';

import CompleteCourseList from '../CompleteCourseList/CompleteCourseList';
import './MandatoryPanel.css';

const url = 'http://localhost:3001';

class MandatoryPanel extends Component {
  state = {
    courses: [],
    coursesAreLoading: true,
  };

  addCheckedProperty = data => {
    return data.map(obj => {
      obj.checked = false;
      return obj;
    });
  };

  fetchCourses = async () => {
    const response = await axios
      .get(`${url}/courses/getAllCourses`)
      .catch(error => {
        console.error(error);
        this.setState({ coursesAreLoading: false });
      });
    if (response) {
      this.setState({
        courses: this.addCheckedProperty(response.data.Response),
        coursesAreLoading: false,
      });
    }
  };

  componentDidMount = () => {
    this.fetchCourses();
  };

  componentWillMount = () => {
    this.selectedCourses = new Set();
  };

  updateCoursesCheckedState = newCourses => {
    this.setState({
      courses: newCourses,
    });
  };

  render() {
    const { coursesAreLoading, courses } = this.state;
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="course-list-container">
          {!coursesAreLoading ? (
            <CompleteCourseList
              courses={courses}
              selectedCourses={this.selectedCourses}
              updateCoursesCheckedState={this.updateCoursesCheckedState}
            />
          ) : (
            <h3>Loading the courses...</h3>
          )}
        </div>
        <div className="spacer" />
      </div>
    );
  }
}

export default MandatoryPanel;
