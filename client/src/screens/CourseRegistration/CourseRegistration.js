import React, { Component } from 'react';
import './CourseRegistration.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import CourseRegistrationItem from './CourseRegistrationItem/CourseRegistrationItem';
import DropDown from '../../components/DropDown';
import SearchBar from '../../components/SearchBar';

const tempData = [
  {
    course_code: 'COMP 202',
    title: 'Foundations of Programming',
  },
  {
    course_code: 'MATH 262',
    title: 'Intermediate Calculus',
  },
  {
    course_code: 'MATH 263',
    title: 'ODEs for Engineers',
  },
  {
    course_code: 'COMP 250',
    title: 'Intro to Computer Science',
  },
  {
    course_code: 'ECSE 428',
    title: 'Software Engineering Project',
  },
  {
    course_code: 'ECSE 429',
    title: 'Software Validation',
  },
];

const tempSemesters = ['Fall 2017', 'Winter 2017', 'Fall 2018', 'Winter 2018'];

class CourseRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSearch: '',
      selectedSemester: tempSemesters[0],
      selectedCourses: [],
    };
    this.updateSelectedSemester = this.updateSelectedSemester.bind(this);
    this.onClickSelect = this.onClickSelect.bind(this);
    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
  }

  // Updates the selected semester in the dropdown
  updateSelectedSemester(selection) {
    this.setState({ selectedSemester: selection });
  }

  // Called on click of Select button, adds the course to list of selected courses
  onClickSelect() {
    this.setState(prevState => {
      // Adds the selected semester to the course object
      const selection = {
        ...prevState.selectedSearch,
        semester: prevState.selectedSemester,
      };
      return {
        selectedCourses: [...prevState.selectedCourses, selection],
      };
    });

    //TODO: Clear input
  }

  // Called on click of a search suggestion, updates the selected course
  onSelectFromSearch(selection) {
    this.setState({ selectedSearch: selection });
  }

  // Removes the course from the selected courses list
  removeCourse(courseIndex) {
    this.setState(prevState => ({
      selectedCourses: prevState.selectedCourses.filter(
        (_, i) => i !== courseIndex
      ),
    }));
  }

  render() {
    return (
      <div className="course-registration">
        <div className="instruction">
          Select the courses that you have already taken.
        </div>
        <div className="content">
          <div className="selection-side">
            <div className="selection-semester">
              <div>Choose the semester: </div>
              <DropDown
                defaultValue={this.state.selectedSemester}
                getValue={this.updateSelectedSemester}
                menuList={tempSemesters}
                className="select"
              />
            </div>
            <div className="selection-course">
              <SearchBar
                className="selection-search"
                data={tempData}
                getValue={this.onSelectFromSearch}
              />
              <button className="selection-button" onClick={this.onClickSelect}>
                Select
              </button>
            </div>
          </div>
          <ul className="selected-side">
            {this.state.selectedCourses.map((el, index) => (
              <CourseRegistrationItem
                key={index}
                course={el}
                index={index}
                onCancel={this.removeCourse}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default WithHeaderBar(CourseRegistration);
