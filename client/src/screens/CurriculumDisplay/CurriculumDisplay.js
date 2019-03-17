import React, { Component } from 'react';
import './CurriculumDisplay.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CourseTable from '../../components/CourseTable'
import DropDown from '../../components/DropDown/DropDown';
import axios from 'axios';

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
    this.fetchCurriculum = this.fetchCurriculum.bind(this);
    this.state = {
      curriculumNames: [],
      selectedCurriculum: "",
      selectedCurriculumDetials: null,
      curriculumError: null,
    };
    this.fetchCurriculum()
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

  getCourseTable(props){
    // typeOfCourses is either core or complimentary, depending on what gets passed from render()

    // nothing is selected
    if (!props.details) return <div>Please select a curriculum from the dropdown menu</div> ;

    // something is selcted but has no courses of the selected type available
    if (!props.details[props.typeOfCourses]) return <div>The selected curriculum has no valid courses at this time.</div>

    console.log([...new Set(props.details[props.typeOfCourses].map(x => x.course_code))])
    return <CourseTable courses={
      // get unique courses by code since there can by duplicates
      // TODO: get number of credits per course
      [...new Set(props.details[props.typeOfCourses].map(c => c.course_code))]
      .map(code => createCourse(code, 3))
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
            {/* <div className="dropdown-section">
              <DropDown
                menuList={["Fall 2015", "Winter 2016"]}
                defaultValue="Select Start Semester"
                getValue={() => console.log("testing")}
              />
            </div>
            <div className="dropdown-section">
              <DropDown
                menuList={["Entry from CEGEP", "International Student", "Entry from out-of-province Highschool"]}
                defaultValue="Select Origin"
                getValue={() => console.log("testing")}
              />
            </div> */}
          </div>

          <div className="curriculum-content">
           
              <div className="semester-course-display" key="Mandatory Courses">
                <div className="semester-name">Mandatory Courses</div>
                <div className="semester-course-table" style={{ width: 512 }}>
                  <this.getCourseTable details={this.state.selectedCurriculumDetials} typeOfCourses={"core_classes"}/>
                </div>
              </div>
              <div className="semester-course-display" key="Technical Complimentary Courses">
                <div className="semester-name">Technical Complimentary Courses</div>
                <div className="semester-course-table" style={{ width: 512 }}>
                  <this.getCourseTable details={this.state.selectedCurriculumDetials} typeOfCourses={"tech_comps"}/>
                </div>
              </div>
           
          </div>
        </div>
      </div >

    );
  }
}

export default WithHeaderBar(CurriculumDisplay);