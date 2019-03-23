import React, { Component } from 'react';

import './CourseSuggestionList.css';
import CourseCheckBox from '../CourseCheckBox/CourseCheckBox';

class CourseSuggestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag,
      courses: props.courses.slice(),
    };
  }

  componentWillMount = () => {
    this.selectedCheckboxes = this.props.loadedCourses;
  };

  handleChange = (index, checked, checkbox) => {
    if (typeof checkbox === 'undefined') {
      return;
    }
    const { tag, courses } = this.state;
    courses[index].checked = checked;
    this.setState({ courses });

    if (this.selectedCheckboxes.has(checkbox)) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is unselected');
    } else {
      this.selectedCheckboxes.add(checkbox);
      console.log(checkbox, 'is selected');
    }
    this.props.updateCoursesCheckedState(tag, courses);
  };

  createCourseList = (course_label, index) => (
    <div className="suggestion-course" key={index}>
      {course_label.course_code}
    </div>
  );

  render() {
    return (
      <div className="course-list">
        <div>
          <h4 className="tag-label">{this.props.tag}</h4>
          {this.props.courses.map((course, index) => (
            <CourseCheckBox
              key={index}
              index={this.props.tag + course.course_code}
              course_code={course.course_code}
              checked={
                this.selectedCheckboxes.has(course.course_code) ? true : false
              }
              handleChange={e =>
                this.handleChange(index, e.target.checked, e.target.name)
              }
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CourseSuggestionList;
