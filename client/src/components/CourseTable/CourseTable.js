import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
        }
        console.log(this.state.courses[0][0])
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
