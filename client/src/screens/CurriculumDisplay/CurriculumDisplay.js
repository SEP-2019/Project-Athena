import React, { Component } from 'react';
import './CurriculumDisplay.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import CourseTable from '../../components/CourseTable';
import DropDown from '../../components/DropDown/DropDown';
import axios from 'axios';
import _ from 'lodash';

class CurriculumDisplay extends Component {
  constructor(props) {
    super(props);
    this.getStudentData = this.getStudentData.bind(this);
    this.parseCourseData = this.parseCourseData.bind(this);
    this.getCourseTable = this.getCourseTable.bind(this);
    this.state = {
      studentId: 123321123, // placeholder student id until sessions/persistance are implemented
      curriculumName: 'View ECSE Curriculums',
      completedCourses: [],
      incompleteCourses: [],
      desiredTechComps: [],
      studentDataError: null,
    };
    this.getStudentData(this.state.studentId);
  }

  /**
   * Fetches the data of a student from the backend, this includes their major, minor,
   * completed courses, and incomplete semesters and courses
   *
   * @param {int} studentid The id of the student
   */
  getStudentData(studentid) {
    axios
      .get('http://localhost:3001/users/getStudentData?studentID=' + studentid)
      .then(response => {
        let res = response.data;

        this.setState({
          curriculumName: res.major[0].curriculum_name,
          completedCourses: this.parseCourseData(
            res.completedCourses,
            'semester'
          ),
          incompleteCourses: this.parseCourseData(
            res.incompletedCore,
            'semester'
          ),
          desiredTechComps: res.desiredTC,
        });
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
  parseCourseData(data, key) {
    let group = _.groupBy(data, key);

    let courses = Object.keys(group).map(function(k) {
      return { semester: k, courses: group[k] };
    });

    return courses;
  }

  /**
   * Passes the given list of courses to the CourseTable component
   *
   * @param {Object} props properties to pass in. Should be in the form of {details: {semester: "W2019", courses: []}, mapFunction: f}
   */
  getCourseTable(props) {
    // nothing is selected
    if (!props.details || props.details.length === 0)
      return <div>No courses found</div>;

    return <CourseTable courses={props.mapFunction(props.details.courses)} />;
  }

  render() {
    return (
      <div className="page">
        <div className="curriculum-display">
          <div className="page-header">
            {'Current Curriculum: ' + this.state.curriculumName}
          </div>
          <div className="curriculum-content">
            <div className="semester-course-display" key="Completed Courses">
              {this.state.completedCourses.map(completedSemester => (
                <div>
                  <div className="semester-name">
                    {completedSemester.semester}
                  </div>
                  <div className="semester-course-table" style={{ width: 512 }}>
                    <this.getCourseTable
                      details={completedSemester}
                      typeOfCourses={'completedCourses'}
                      mapFunction={courses => courses}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="semester-course-display" key="Incomplete Courses">
              {this.state.incompleteCourses.map(incompleteSemester => (
                <div>
                  <div className="semester-name">
                    {incompleteSemester.semester}
                  </div>
                  <div className="semester-course-table" style={{ width: 512 }}>
                    <this.getCourseTable
                      details={incompleteSemester}
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
