 /* eslint-disable */
import React, { Component } from 'react';
import ExpandableCourse from '../ExpandableCourse/ExpandableCourse';
import DropDown from '../DropDown/DropDown';

import './CourseTable.css';

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
    this.renderSemester = this.renderSemester.bind(this);

    this.state = {
      useDropdown: props.useDropdown,
      courses: this.getUniqueCoursesByCode(props.courses),
      selectedCourses: [],
      selectedThing: "",
      coursesPerSemseter: 6,
    };
  }

  componentDidMount(){
    this.setState({
      selectedCourses: Array(this.state.courses.length).fill("no course selected")
    })
  }

  /**
   * Gets the unique courses by course code in case duplicates are fetched from the endpoint
   */
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

  /**
   * Makes the previously selected course selectable again
   * and makes the currently selected course unselectable by other dropdowns
   * 
   * @param {Object} selection 
   * @param {int} index 
   * @param {Object} metaData 
   */
  updateSelectedCourse(selection, index, metaData){ 
    let prevSelectedValue = this.state.selectedCourses[index]

    let newSelection = this.state.selectedCourses
    newSelection[index] = selection
    
    let selectableCourses = this.state.courses

    // make the previously selected value available for selection again
    // there shouldn't be duplicate courses, so filtering by course code shouldn't be a problem
    selectableCourses.filter(c => c.course_code === prevSelectedValue.course_code).map(course => course.isDisabled = false)

    // make the selected course not selectable anymore to avoid duplicate selection.
    // if the same value is selected again, it should overwrite the reset operation
    selectableCourses[parseInt(metaData.key)].isDisabled = true

    this.setState({
      courses: selectableCourses,
      selectedCourses: newSelection,
    })
  }

  /**
   * Renders the content for a single course slot
   * 
   * @param {Object} props 
   */
  renderCourseTable(props){
    return props.useDropdown
    ?
    <div className="with-border">
      <DropDown
        defaultValue={this.state.selectedCourses[props.index]}
        getValueWithIndex={this.updateSelectedCourse}
        menuList={this.state.courses}
        associatedIndex={props.index}
        useAlternateStyle={true}
        disabledItems = {this.state.courses.map(c => c.isDisabled)}
      />
    </div>
    :
    <ExpandableCourse
      index={props.index}
      course_code={props.course_code}
      description={props.description}
    />
  }

  /**
   * Renders the content for a semester
   * 
   * In  the case of completed semesters/courses, they will be displayed in an expandable course component.
   * If that's the case, render all courses completed in those given semesters.
   * In the case of future semesters where students still have to choose their courses, assume that a student
   * can choose a maximum of 6 courses per term. As a result, render 6 dropdown components for each semester
   * 
   * @param {Object} props 
   */
  renderSemester(props){
    return this.state.useDropdown
    ? [...Array(this.state.coursesPerSemseter).keys()].map((element, index) => (
      <this.renderCourseTable
        key={index}
        index={index}
        useDropdown={this.state.useDropdown}
      />
    ))
    : this.state.courses.map((course, index) => (
      <this.renderCourseTable
        key={index}
        index={index}
        course_code={course.course_code}
        description={course.description}
        useDropdown={this.state.useDropdown}
      />
    ))
  }
    
  render() {
    return (
      <div>
        <this.renderSemester/>
      </div>
    );
  }
}

export default CourseTable;
