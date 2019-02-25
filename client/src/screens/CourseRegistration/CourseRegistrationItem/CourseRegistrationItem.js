import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CourseRegistrationItem.css';
import cancel from '../../../images/cancel.svg';

class CourseRegistrationItem extends Component {
  handleClick() {
    this.props.onCancel(this.props.index);
  }

  render() {
    const course = this.props.course;
    return (
      <li className="item">
        <div className="item-divider">
          <div className="course-number">{course.course_code}</div>
          <div className="course-title">{course.title}</div>
        </div>
        <div className="item-divider">
          <div className="semester">{course.semester}</div>
          <img
            src={cancel}
            alt="x"
            className="cancel"
            onClick={() => this.handleClick()}
          />
        </div>
      </li>
    );
  }
}

CourseRegistrationItem.propTypes = {
  course: PropTypes.object,
  index: PropTypes.number,
  onCancel: PropTypes.func,
};

export default CourseRegistrationItem;
