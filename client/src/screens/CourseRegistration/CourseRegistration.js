import React, { Component } from 'react';
import axios from 'axios';
import './CourseRegistration.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import CourseRegistrationItem from './CourseRegistrationItem/CourseRegistrationItem';
import DropDown from '../../components/DropDown';
import SearchBar from '../../components/SearchBar';

class CourseRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [], // list of all courses to select
      semesters: [], // list of all semesters to select
      selectedSearch: {}, // selected course (updates on hover)
      selectedSemester: '', // selected semester
      selectedCourses: [], // courses that have already been selected
    };
    this.updateSelectedSemester = this.updateSelectedSemester.bind(this);
    this.onClickSelect = this.onClickSelect.bind(this);
    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
    this.findSemesters = this.findSemesters.bind(this);
    this.fetchAllCourses = this.fetchAllCourses.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
  }

  // Updates the selected semester in the dropdown
  updateSelectedSemester(selection) {
    this.setState({ selectedSemester: selection });
  }

  // Called on click of Select button, adds the course to list of selected courses
  onClickSelect() {
    this.setState(prevState => {
      // Prevents adding the same course twice
      if (
        prevState.selectedCourses.some(
          course => course.course_code === prevState.selectedSearch.course_code
        )
      ) {
        return null;
      }

      // Prevents adding course without selecting a semester
      if (!prevState.selectedSemester) {
        return null;
      }

      // Adds the selected semester to the course object
      const selection = {
        ...prevState.selectedSearch,
        semester: prevState.selectedSemester,
      };
      return {
        selectedCourses: [...prevState.selectedCourses, selection],
      };
    });
  }

  // Called on click of a search suggestion, updates the selected course
  onSelectFromSearch(selection) {
    this.setState({ selectedSearch: selection }); // this is where the warning appears
  }

  // Removes the course from the selected courses list
  removeCourse(courseIndex) {
    this.setState(prevState => ({
      selectedCourses: prevState.selectedCourses.filter(
        (_, i) => i !== courseIndex
      ),
    }));
  }

  // Returns the semesters displayed in the drop down
  findSemesters(startYear) {
    const today = new Date();
    const currentYear = today.getFullYear();
    let year = startYear;
    let semesters = [];
    for (year; year <= currentYear; year++) {
      if (year === startYear) {
        semesters.push('Fall ' + year.toString());
      } else if (year === currentYear) {
        semesters.push('Winter ' + year.toString());
        if (today.getMonth() > 8) {
          semesters.push('Fall ' + year.toString());
        }
      } else {
        semesters.push('Winter ' + year.toString());
        semesters.push('Fall ' + year.toString());
      }
    }
    return semesters;
  }

  // TODO: remove harcoded student id
  // TODO: get base URL by importing from a base instance
  fetchUserData = async () => {
    return await axios.get(
      'http://localhost:3001/users/getStudentData?studentID=999999999'
    );
  };

  fetchAllCourses = async () => {
    return await axios.get('http://localhost:3001/courses/getAllCourses');
  };

  componentDidMount() {
    axios
      .all([this.fetchAllCourses(), this.fetchUserData()])
      .then(
        axios.spread((courses, user) => {
          let coursesData = courses.data.Response;
          let userData = user.data.Response;
          const major = userData.major[0].curriculum_name;
          // find start year of the student
          const year = parseInt(major.split('|')[1]);
          this.setState({
            semesters: this.findSemesters(year),
            allCourses: coursesData,
          });
        })
      )
      .catch(error => console.log('ERROR', error));
  }

  render() {
    const { allCourses, semesters } = this.state;

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
                menuList={semesters}
                className="select"
              />
            </div>
            <div className="selection-course">
              <SearchBar
                className="selection-search"
                data={allCourses}
                getValue={this.onSelectFromSearch}
                onClickSelect={this.onClickSelect}
              />
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
