import React, { Component } from 'react';
import ExpandableCourse from '../ExpandableCourse/ExpandableCourse';
import DropDown from '../DropDown/DropDown';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class CourseTable extends Component {
  handleChange(event) {
    this.props.getValue(event.target.value);
  }
    
  constructor(props) {
    super(props);

    this.renderCourseTable = this.renderCourseTable.bind(this);

    this.state = {
      useDropdown: props.useDropdown,
      courses: props.courses,
      selectedCourses: [],
    };
  }

  componentDidMount(){
    this.setState({
      selectedCourses: Array(this.state.courses.length)
    })
  }

  updateSelectedCourse(selection){

  }

  renderCourseTable(props){
    return props.useDropdown
    ?
    <DropDown
      defaultValue={"fuck"}
      getValue={() => console.log("s")}
      menuList={this.state.courses.map(c => c.course_code)}
      className="select"
      disabledItems = {this.state.courses.map(c => c.isDisabled)}
    />
    :
    <ExpandableCourse
      index={props.index}
      course_code={props.course_code}
      description={props.description}
    />
  }
    
  render() {
    return (
      <div>
        <Table>
          <TableBody>
            {this.state.courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell key={index}>
                  <this.renderCourseTable
                    key={index}
                    index={index}
                    course_code={course.course_code}
                    description={course.course_code}
                    useDropdown={this.state.useDropdown}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default CourseTable;
