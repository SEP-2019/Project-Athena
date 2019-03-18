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
      curriculumName: "View ECSE Curriculums",
      completedCourses: [],
      incompleteCourses: [],
      studentDetails: null,
      selectedCurriculum: "View ECSE Curriculums",
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
      console.log(res)
      this.setState({
        curriculumName: res.major[0].curriculum_name, 
        completedCourses: this.parseCourseData(res.completedCourses, "semester"),
        incompleteCourses: this.parseCourseData(res.incompletedCore, "semester"),
      })
      console.log(this.state)
    })
    .catch(studentDataError =>
      this.setState({studentDataError})
    )
  }

  parseCourseData(data, key){

    // transform the data into the format: [{semester: "W2019", courses: [{course_code: "ECSE 428", course_name: "SWE practice"}]}]
    // go through the completed courses and group them by semester
    let group = _.groupBy(data, key)
    console.log(group)
    let courses = Object.keys(group)
      .map(function(k) { 
        return {semester: k, courses: group[k]}
      })
      //console.log(courses)
      return courses
  }

  getCompletedCourseTables(props){
    if(!props.completedCourses) return <div>No semesters completed</div>

    return this.getCourseTable({details: props.completedCourses})//props.completedCourses.map(c => this.getCourseTable(props.completedCourses))
  }

  getCourseTable(props){

    console.log(props)

    // nothing is selected
    if (!props.details || props.details.length === 0) return <div>No courses found</div> ;

        //if (!props.details[props.typeOfCourses]) return <div>The selected curriculum has no valid courses at this time.</div>

    //console.log(props.details.map(function(c) {return {course_code: c.course_code}} ) )

   

    return <CourseTable courses={
      props.mapFunction(props.details.courses)
    }/>;
  }

  render() {
    return (
      <div className="page">
        <div className="curriculum-display">
          <div className="page-header">{"Current Curriculum: " + this.state.curriculumName}</div>
          <div className="curriculum-content">
           
              <div className="semester-course-display" key="Mandatory Courses">
                 {this.state.completedCourses.map ((completedSemester) => (
                   <div>
                    <div className="semester-name">{completedSemester.semester}</div>
                      <div className="semester-course-table" style={{ width: 512 }}>
                      <this.getCourseTable 
                      details={completedSemester} 
                      typeOfCourses={"completedCourses"}
                      mapFunction = { courses => courses}
                      />
                      </div>
                     </div>
                 ))}
                  
                
              </div>
              <div className="semester-course-display" key="Technical Complimentary Courses">
                
                {this.state.incompleteCourses.map ((incompleteSemester) => (
                  <div>
                    <div className="semester-name">{incompleteSemester.semester}</div>
                    <div className="semester-course-table" style={{ width: 512 }}>
                      <this.getCourseTable 
                        details={incompleteSemester} 
                        typeOfCourses={"incompleteCourses"}
                        mapFunction = { courses => courses}
                      />
                    </div>
                  </div>
                ))}
              </div>
           
          </div>
        </div>
      </div >

    );
  }
}

export default WithHeaderBar(CurriculumDisplay);