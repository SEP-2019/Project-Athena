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

  componentWillMount = () => {
    this.selectedCheckboxes = this.props.selectedCourses;
  };

  handleChange(index, checked, checkbox) {
    const { courses } = this.state;
    courses[index].checked = checked;
    this.setState({ courses });

    if (this.selectedCheckboxes.has(checkbox)) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is unselected');
    } else {
      this.selectedCheckboxes.add(checkbox);
      console.log(checkbox, 'is selected');
    }
    //TODO: Store in cookie
    this.props.updateCoursesCheckedState(courses);
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
                course_code={course.course_code + ' ー ' + course.title}
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
