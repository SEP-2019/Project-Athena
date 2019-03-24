import React, { Component } from 'react';
import './CurriculumDisplay.css';
import Api from '../../services/Api'
import WithHeaderBar from '../../hocs/WithHeaderBar';
import CourseTable from '../../components/CourseTable';
import _ from 'lodash';
import Cookies from 'universal-cookie';

class CurriculumDisplay extends Component {

  constructor(props) {

    super(props);
    this.getStudentData = this.getStudentData.bind(this);
    this.parseCourseData = this.parseCourseData.bind(this);
    this.renderCourseTable = this.renderCourseTable.bind(this);
    this.renderLoadingMessage = this.renderLoadingMessage.bind(this);
    this.state = {
      loadingMessage: "Loading curriculum information...",
      studentId: null, // placeholder student id until sessions/persistance are implemented
      curriculumName: 'View ECSE Curriculums',
      completedCourses: [],
      incompleteCourses: [],
      desiredTechComps: [],
      studentDataError: null,
    };

    this.cookies = new Cookies();
  }

  componentDidMount(){
    this.setState({
        studentId : this.cookies.get('studentId'),
    },
    () => this.getStudentData(this.state.studentId));
  }
  
  /**
   * Fetches the data of a student from the backend, this includes their major, minor,
   * completed courses, and incomplete semesters and courses
   *
   * @param {int} studentid The id of the student
   */
  getStudentData(studentid) {
    Api()
      .get('users/getStudentData?studentID=' + studentid)
      .then(response => {

        let res = response.data.Response;
        
        console.log(res)

        this.setState({
          curriculumName: res.major[0].curriculum_name,
          completedCourses: this.parseCourseData(
            res.completedCourses,
            'semester'
          ),
        }, () => {
          // need to call set state again after since checking the prereqs for incomplete courses
          // requires that completed courses is defined first
          this.setState({
            incompleteCourses: this.parseCourseData(
              res.incompletedCore.concat(res.desiredTC),
              'semester',
              this.state.completedCourses.map(cc => cc.courses).flat(),
            ),
            desiredTechComps: this.parseCourseData(
              res.desiredTC,
              'semester',
              this.state.completedCourses.map(cc => cc.courses).flat(),
            ),
            loadingMessage: "",
          })
        })
      })
      .catch(studentDataError => this.setState({ studentDataError }));
  }

  /**
   * Goes through the given course data, groups it by the given key, then transforms it into the following format:
   * [{semester: "W2019", courses: [{course_code: "ECSE 428", course_name: "SWE practice"}]}]
   *
   * @param {Object} data course data to be parsed
   * @param {string} key which key to group the data by
   */
  parseCourseData(data, key, completedCourses = []) {
    let group = _.groupBy(data, key);

    console.log(completedCourses)

    let courses = Object.keys(group).map(function(k) {
      for(var i = 0; i < group[k].length; i++){
        let hasPrereqs = false

        // check if the student has the prereqs for the current course
          try{
            // if the prereqs are empty, assume the course has no prereqs and thus the
            // student has all the requirements to take the course
            // or else, check that the list of completed courses contains every prereq course
            // for the current course
            hasPrereqs = (group[k][i].prereqs === undefined || group[k][i].prereqs.length <= 0) ? true :
            group[k][i].prereqs.every(prereq => {
              completedCourses.some(c => c.course_code === prereq.prereq_course_code)
            })
          }
          catch(error){
            console.log(error)
          }
        
        group[k][i].isDisabled = !hasPrereqs
      }

      console.log(group[k])
      group[k].map(course => course.displayMember = course.course_code + " - " + course.description[0].title)

      console.log(group[k])

      return { semester: k, courses: group[k] };
    });

    return courses;
  }

  /**
   * Passes the given list of courses to the CourseTable component
   *
   * @param {Object} props properties to pass in. Should be in the form of {details: {semester: "W2019", courses: []}, mapFunction: f}
   */
  renderCourseTable(props) {
    // nothing is selected
    if (!props.details || props.details.length === 0){
      return <div>No courses found</div>;
    }
  
    return <CourseTable 
      courses={props.mapFunction(props.details.courses)}
      useDropdown={props.useDropdown} 
    />;
  }

  /**
   * Renders the loading message while the courses are being fetched
   * 
   * @param {Object} props 
   */
  renderLoadingMessage(props){
    return props.message ? <div>{props.message}</div> : (null)
  }

  render() {
    return (
      <div className="page">
        <div className="curriculum-display">
          <div className="page-header">
            {'Current Curriculum: ' + this.state.curriculumName}
          </div>
          <this.renderLoadingMessage message = {this.state.loadingMessage}/>
          <div className="curriculum-content">
            <div className="semester-course-display" key="Completed Courses">
              {this.state.completedCourses.map((completedSemester, index) => (
                <div key={"Complete__" + index}>
                  <div className="semester-name" key={"Completed_" + index}>
                    {completedSemester.semester}
                  </div>
                  <div className="semester-course-table" style={{ width: 512 }} key={"Completed_child_" + index}>
                    <this.renderCourseTable
                      details={completedSemester}
                      useDropdown={false}
                      typeOfCourses={'completedCourses'}
                      mapFunction={courses => courses}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="semester-course-display" key="Incomplete Courses">
            {/* make the selectable courses for then incomplete semesters the union of incomplete courses and desired TCs */}
              {this.state.incompleteCourses.map((incompleteSemester, index) => (
                <div key={"Incomplete__" + index}>
                  <div className="semester-name" key={"Incomplete_" + index}>
                    {incompleteSemester.semester}
                  </div>
                  <div className="semester-course-table" style={{ width: 512 }} key={"Incomplete_child" + index}>
                    <this.renderCourseTable
                      details={incompleteSemester}
                      useDropdown={true}
                      typeOfCourses={'incompleteCourses'}
                      mapFunction={courses => courses}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WithHeaderBar(CurriculumDisplay);
