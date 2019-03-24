import React, { Component } from 'react';
import Api from '../../services/Api';
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
      selectedSemester: 'semester', // selected semester
      selectedCourses: [], // courses that have already been selected
      disabledButton: false,
      loading: true,
    };
    this.updateSelectedSemester = this.updateSelectedSemester.bind(this);
    this.onSelectCourse = this.onSelectCourse.bind(this);
    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);
    this.removeCourse = this.removeCourse.bind(this);
    this.findSemesters = this.findSemesters.bind(this);
    this.fetchAllCourses = this.fetchAllCourses.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  // Updates the selected semester in the dropdown
  updateSelectedSemester(selection) {
    this.setState({ selectedSemester: selection });
    this.onSelectCourse();
  }

  // Adds the course to list of selected courses
  onSelectCourse() {
    this.setState(prevState => {
      // Prevents adding the same course twice
      if (
        prevState.selectedCourses.some(
          course => course.course_code === prevState.selectedSearch.course_code
        )
      ) {
        return null;
      }

      // Prevents adding course without selecting a course
      if (Object.keys(prevState.selectedSearch).length === 0) {
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

    // TODO: generate the semesters
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
        semesters.push('F' + year.toString());
      } else if (year === currentYear) {
        semesters.push('W' + year.toString());
        if (today.getMonth() > 8) {
          semesters.push('F' + year.toString());
        }
      } else {
        semesters.push('W' + year.toString());
        semesters.push('F' + year.toString());
      }
    }
    this.setState({ loading: false });
    return semesters;
  }

  // TODO: remove harcoded student id
  // TODO: get base URL by importing from a base instance
  fetchUserData = async () => {
    return await Api().get('/users/getStudentData?studentID=999999999');
  };

  fetchAllCourses = async () => {
    return await Api().get('/courses/getAllCourseOfferings');
  };

  componentDidMount() {
    this.fetchUserData()
      .then(response => {
        let userData = response.data.Response;
        const major = userData.major[0].curriculum_name;
        // find start year of the student
        const year = parseInt(major.split('|')[1]);
        this.setState({ semesters: this.findSemesters(year) });
        //TODO: Save the completedCourses and display them
      })
      .catch(error => console.log('ERROR', error));

    // this.fetchAllCourses()
    //   .then(response => {
    //     let courseData = response.data.Response;
    //     this.setState({ allCourses: courseData });
    //   })
    //   .catch(error => console.log('ERROR', error));
  }

  // Formats the courses for the POST request
  formatCompletedCourses(completedCourses) {
    let courses = {};
    completedCourses.forEach(course => {
      courses[course.course_code] = [{ semester: course.semester, section: 1 }];
    });
    return courses;
  }

  // POST request to save the completed courses
  onClickSave() {
    let completedCourses = {
      courses: this.formatCompletedCourses(this.state.selectedCourses),
      student_id: 260485294,
    };

    console.log(completedCourses);

    Api()
      .post('/courses/addCompletedCourses', {
        completedCourses,
      })
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  }

  render() {
    const { allCourses, semesters } = this.state;

    return (
      <div className="course-registration">
        <div className="instruction">
          Find the courses that you have already taken, then select the semester
          you took it in. These courses will then appear in the Curriculum page.
        </div>
        <div className="content">
          <div className="selection-side">
            <div className="selection-course">
              <SearchBar
                className="selection-search"
                data={allCourses}
                getValue={this.onSelectFromSearch}
              />
              {this.state.loading ? (
                <div className="animation-wrapper">
                  <div className="lds-ellipsis">
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              ) : (
                <DropDown
                  defaultValue={this.state.selectedSemester}
                  getValue={this.updateSelectedSemester}
                  menuList={semesters}
                  className="select"
                />
              )}
            </div>
          </div>
          <div className="selected-size-frame">
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
            <div className="selection-save">
              <button
                className="save-button"
                onClick={this.onClickSave}
                disabled={this.state.disabledButton}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WithHeaderBar(CourseRegistration);
