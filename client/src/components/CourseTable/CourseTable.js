import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const overrideStyle = {
    color: '#FFFFFF',
    fontSize: '0.8rem',
    padding: '3px 0 3px 15px',
};

function createData(courseName, numCredits) {
    return { courseName, numCredits };
}

class CourseTable extends Component {
    handleChange(event) {
        this.props.getValue(event.target.value);
    }

    constructor(props) {
        super(props);

        console.log(props.children);

        this.state = {
            courses: props.children,
        }

        console.log(this.state)
    }


    render() {
        return (
            // by default the table will span the width of the screen. Width should be
            // specified by its parent element
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course</TableCell>
                            <TableCell align="right">Number of Credits</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.courses.map((course) => (
                            <TableRow key={course.courseName}>
                                <TableCell>{course.courseName}</TableCell>
                                <TableCell align="right">{course.numCredits}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

CourseTable.propTypes = {
    courses: PropTypes.shape({
        courseName: PropTypes.string,
        numCredits: PropTypes.number,
    }),
};

export default CourseTable;
