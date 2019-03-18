import React, { Component } from 'react';
import './CurriculumDisplay.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CourseTable from '../../components/CourseTable'
import DropDown from '../../components/DropDown/DropDown';
import axios from 'axios';
import _ from 'lodash'
import { runInThisContext } from 'vm';

function createCourse(courseName, numCredits) {
  return { courseName, numCredits };
}

function createSemester(name, courses) {
  return { name, courses }
}

class CurriculumDisplay extends Component {
  constructor(props) {
    super(props);
    this.updateSelectedCurriculum = this.updateSelectedCurriculum.bind(this);
    this.getStudentData = this.getStudentData.bind(this);
    this.fetchCurriculum = this.fetchCurriculum.bind(this);
    this.parseCourseData = this.parseCourseData.bind(this);
    this.getCourseTable = this.getCourseTable.bind(this);
    this.getCompletedCourseTables = this.getCompletedCourseTables.bind(this)
    this.state = {
      studentId: 123321123,
      curriculumNames: [],
      curriculumName: "",
      completedCourses: [],
      incompleteCourses: [],
      studentDetails: null,
      selectedCurriculum: "",
      selectedCurriculumDetials: null,
      curriculumError: null,
      studentDataError: null,
    };
    this.fetchCurriculum()
    this.getStudentData(this.state.studentId)
  }

  fetchCurriculum() {
    // first get the list of the curriculum names, then fetch each curriculum
    axios
      .get('http://localhost:3001/curriculums/getAllCurriculumNames')
      .then(response => 
        this.setState({
          curriculumNames: response.data,
        })
      )
      .catch(curriculumError =>
        this.setState({ curriculumError })
      );
  }

  updateSelectedCurriculum(selected){
    axios
    .get('http://localhost:3001/curriculums/getCurriculum?name=' + selected)
    .then(response => {
      console.log(response.data)
      this.setState({
        selectedCurriculum: selected,
        selectedCurriculumDetials: response.data,
      })
    })
    .catch(curriculumError =>
      this.setState({curriculumError})
    )
  }

  getStudentData(studentid){
    axios
    .get('http://localhost:3001/users/getStudentData?studentID=' + studentid)
    .then(response => {
      let res = response.data
      this.setState({
        curriculumName: res.major[0], 
        completedCourses: this.parseCourseData(res.completedCourses, "semester"),
        //incompleteCourses: this.parseCourseData(res.incompletedCore, "semseter"),
      })
      console.log(this.state)
    })
    .catch(studentDataError =>
      this.setState({studentDataError})
    )
  }

  parseCourseData(data, key){
    // go through the completed courses and group them by semester
    let group = _.groupBy(data, key)
    let courses = Object.keys(group)
      .map(function(k) { 
        return {semester: k, courses: group[k]}
      })
      console.log(courses)
      return courses
  }

  getCompletedCourseTables(props){
    if(!props.completedCourses) return <div>No semesters completed</div>

    return this.getCourseTable({details: props.completedCourses})//props.completedCourses.map(c => this.getCourseTable(props.completedCourses))
  }

  getCourseTable(props){
    // typeOfCourses is either core or complimentary, depending on what gets passed from render()

    // nothing is selected
    if (!props.details) return <div>No courses found</div> ;

    
    // something is selcted but has no courses of the selected type available
    //if (!props.details[props.typeOfCourses]) return <div>The selected curriculum has no valid courses at this time.</div>

    //console.log(props.details.map(function(c) {return {course_code: c.course_code}} ) )

    console.log(props)

    return <CourseTable courses={
      // get unique courses by code since there can by duplicates
      // TODO: get number of credits per course
      //props.mapFunction(props.details)
      props.details.map(c => c[0].courses)
    } />;
  }

  render() {
    return (
      <div className="page">
        <div className="curriculum-display">
          <div className="page-header">View ECSE Curriculums</div>
          <div className="curriculum-selection-menu">
            <div className="dropdown-section">
              <DropDown
                menuList={this.state.curriculumNames}
                defaultValue={this.state.selectedCurriculum}
                getValue={this.updateSelectedCurriculum}
              />
            </div>
          </div>

          <div className="curriculum-content">
           
              <div className="semester-course-display" key="Mandatory Courses">
                <div className="semester-name">Mandatory Courses</div>
                <div className="semester-course-table" style={{ width: 512 }}>

                 
                  <this.getCourseTable 
                    details={this.state.completedCourses} 
                    typeOfCourses={"completedCourses"}
                    mapFunction = { (courses) => courses.map(function(c) {return {course_code: c.course_code}}) }
                    />
                  
                </div>
              </div>
              <div className="semester-course-display" key="Technical Complimentary Courses">
                <div className="semester-name">Technical Complimentary Courses</div>
                <div className="semester-course-table" style={{ width: 512 }}>
                  {/* <this.getCourseTable
                    details={this.state.incompleteCourses}
                    typeOfCourses={"incompleteCourses"}
                    mapFunction = { (course) =>  course.course_code}
                    /> */}
                </div>
              </div>
           
          </div>
        </div>
      </div >

    );
  }
}

export default WithHeaderBar(CurriculumDisplay);