import React, { Component } from 'react';
import axios from 'axios';

import CompleteCourseList from '../CompleteCourseList/CompleteCourseList';
import './MandatoryPanel.css';

class MandatoryPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      coursesAreLoading: true,
      courseError: null,
    };
  }

  addCheckedProperty(json) {
    return json.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  fetchCourses() {
    axios
      .get('http://localhost:3001/courses/getAllCourses')
      .then(response =>
        this.setState({
          courses: this.addCheckedProperty(response.data),
          coursesAreLoading: false,
        })
      )
      .catch(courseError =>
        this.setState({ courseError, coursesAreLoading: false })
      );
  }

  componentDidMount() {
    this.fetchCourses();
  }

  componentWillMount = () => {
    this.selectedCourses = new Set();
  };

  updateCoursesCheckedState = newCourses => {
    this.setState({
      courses: newCourses,
    });
  };

  render() {
    const { coursesAreLoading, courses, courseError } = this.state;
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="course-list-container">
          {console.log(this.state.courses)}
          {!coursesAreLoading ? (
            <CompleteCourseList
              courses={courses}
              selectedCourses={this.selectedCourses}
              updateCoursesCheckedState={this.updateCoursesCheckedState}
              errorMessage={content =>
                courseError ? (
                  <p className="Error">{courseError.message}</p>
                ) : (
                  content
                )
              }
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
