import React, { Component } from 'react';
import ExpandableCourse from '../ExpandableCourse/ExpandableCourse';

const overrideStyle = {
    color: '#FFFFFF',
    fontSize: '0.8rem',
    padding: '3px 0 3px 15px',
};

class CourseTable extends Component {
    handleChange(event) {
        this.props.getValue(event.target.value);
      }
    
      constructor(props) {
        super(props);
        this.state = {
          courses: props.courses,
        };
      }
    
      render() {
        return (
          <div>
            {this.state.courses.map((course, index) => (
              <ExpandableCourse
                key={index}
                index={index}
                course_code={course.course_code}
                description={course.course_code}
              />
            ))}
          </div>
        );
      }
}

export default CourseTable;
