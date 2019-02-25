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

  //TODO: to be changed
  handleChange(index, checked, checkbox) {
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
    //TODO: Store in cookie
    this.props.updateCoursesCheckedState(tag, checkbox, courses);
  }

  createSuggestionList = (tag, index) => (
    <div className="tag" key={index}>
      <h4>{tag.name}</h4>
      {tag.courses.map(this.createCourseList)}
      {/* {tag.courses.map((course, index) => (
        <CourseCheckBox
          key={index}
          index={index}
          name={course.course_code}
          checked={course.checked}
          handleChange={e =>
            this.handleChange(index, e.target.checked, e.target.course_code)
          }
        />
      ))} */}
    </div>
  );

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
          {this.props.errorMessage(
            this.props.courses.map((course, index) => (
              <CourseCheckBox
                key={index}
                index={index}
                course_code={course.course_code}
                checked={
                  this.selectedCheckboxes.has(course.course_code) ? true : false
                }
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

export default CourseSuggestionList;
