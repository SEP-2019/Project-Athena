import React, { Component } from 'react';
import './CurriculumDisplay.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';

import CourseTable from '../../components/CourseTable'
import DropDown from '../../components/DropDown/DropDown';

function createCourse(courseName, numCredits) {
  return { courseName, numCredits };
}

function createSemester(name, courses){
  return { name, courses }
}

function dummyData() {
  return [
    createSemester('Fall 2015', 
      [
        createCourse('COMP 202', 3),
        createCourse('MATH 262', 3),
        createCourse('MATH 263', 3),
        createCourse('[Complimentary Group A]', 3),
        createCourse('[Complimentary Group B]', 3),
      ]
    ),
    createSemester('Winter 2016', 
      [
        createCourse('ECSE 200', 3),
        createCourse('ECSE 212', 3),
        createCourse('COMP 250', 3),
        createCourse('MATH 270', 3),
        createCourse('FACC 100', 1),
      ]
    ),
    createSemester('Fall 2016', 
      [
        createCourse('ECSE 211', 42069),
        createCourse('COMP 206', 3),
        createCourse('COMP 251', 3),
        createCourse('ECSE 210', 3),
        createCourse('CCOM 206', 3),
      ]
    ),
    createSemester('Winter 2017', 
      [
        createCourse('ECSE 306', 3),
        createCourse('ECSE DSD', 5),
        createCourse('MATH 360', 3),
        createCourse('ECSE 333', 3),
      ]
    )
  ]
}

class CurriculumDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page">
        <div className="curriculum-display">
          <div className="curriculum-selection">
            {/* <DropDown
              menuList = {["one", "two", "three"]}
              defaultValue = "Select curriculum"
              getValue = {() => console.log("testing")}
            /> */}
            The dropdowns will go here
          </div>
          <div className="content">
          {dummyData().map((semester) => (
            <div className="semester-course-display" key={semester.name}>
              <div className="semester-name">{semester.name}</div>
              <div className="semester-course-table" style={{ width: 512 }}>
                <CourseTable courses = {semester.courses}/>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }
}

export default WithHeaderBar(CurriculumDisplay);