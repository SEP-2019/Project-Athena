import React, { Component } from 'react';

import ExpandableCourse from '../ExpandableCourse/ExpandableCourse';
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
              <ExpandableCourse
                key={index}
                index={index}
                course_code={course.course_code + ' ー ' + course.title}
                description={course.description}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default CompleteCourseList;
