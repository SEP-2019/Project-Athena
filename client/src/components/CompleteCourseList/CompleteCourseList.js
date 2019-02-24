import React, { Component } from 'react';

import CourseCheckBox from '../CourseCheckBox/CourseCheckBox';
import './CompleteCourseList.css';

class CompleteCourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: props.courses.slice(),
    };
  }
  render() {
    return (
      <div className="course-list">
        <div>
          {this.props.errorMessage(
            this.props.courses.map((course, index) => (
              <CourseCheckBox
                key={index}
                index={index}
                course_code={course.course_code}
                checked={course.checked}
                handleChange={e =>
                  this.handleChange(index, e.target.checked, e.target.name)
                }
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default CompleteCourseList;
