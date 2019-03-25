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

  componentDidUpdate = () => {
    this.selectedCheckboxes = this.props.selectedCourses;
  };

  componentWillMount = () => {
    this.selectedCheckboxes = this.props.selectedCourses;
  };

  handleChange = (index, checked, checkbox) => {
    if (typeof checkbox === 'undefined') {
      return;
    }
    const { courses } = this.state;
    courses[index].desired = checked | 0;
    this.setState({ courses });

    if (this.selectedCheckboxes.has(checkbox)) {
      this.selectedCheckboxes.delete(checkbox);
      this.props.updateSelected(false, checkbox);
    } else {
      this.selectedCheckboxes.add(checkbox);
      this.props.updateSelected(true, checkbox);
    }
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
          {console.log(this.props.tag, this.selectedCheckboxes)}
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
              description={course.description}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CourseSuggestionList;
