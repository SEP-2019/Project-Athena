 /* eslint-disable */
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
    this.updateSelectedCourse = this.updateSelectedCourse.bind(this);
    this.getUniqueCoursesByCode = this.getUniqueCoursesByCode.bind(this);

    this.state = {
      useDropdown: props.useDropdown,
      courses: this.getUniqueCoursesByCode(props.courses),
      selectedCourses: [],
      selectedThing: "",
    };
  }

  componentDidMount(){
    this.setState({
      selectedCourses: Array(this.state.courses.length).fill("no course selected")
    })
  }

  getUniqueCoursesByCode(courses){
    let codes = {}
    let uniqueCourses = []
    for(var i = 0; i < courses.length; i++){
      if (!codes[courses[i].course_code]){
        uniqueCourses.push(courses[i])
        codes[courses[i].course_code] = true
      }
    }

    return uniqueCourses
  }

  updateSelectedCourse(selection, index, metaData){ 
    console.log(metaData)

    let prevSelectedValue = this.state.selectedCourses[index]
    console.log(prevSelectedValue)

    let newSelection = this.state.selectedCourses
    newSelection[index] = selection
    
    let selectableCourses = this.state.courses

    // make the previously selected value available for selection again
    // there shouldn't be duplicate courses, so filtering by course code shouldn't be a problem
    selectableCourses.filter(c => c.course_code === prevSelectedValue).map(course => course.isDisabled = false)

    // make the selected course not selectable anymore to avoid duplicate selection.
    // if the same value is selected again, it should overwrite the reset operation
    selectableCourses[parseInt(metaData.key)].isDisabled = true
   

    this.setState({
      courses: selectableCourses,
      selectedCourses: newSelection,
    })

    
  }

  renderCourseTable(props){
    return props.useDropdown
    ?
    <DropDown
      defaultValue={this.state.selectedCourses[props.index]}
      getValueWithIndex={this.updateSelectedCourse}
      menuList={this.state.courses.map(c => c.course_code)}
      className="select"
      associatedIndex={props.index}
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
