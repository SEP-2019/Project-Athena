import React, { Component } from 'react';
import Api from '../../services/Api';
import './AdminPanel.css';
import WithHeaderBar from '../../hocs/WithHeaderBar';

import SearchBar from '../../components/SearchBar';

import MandatoryPanel from '../../components/MandatoryPanel/MandatoryPanel';
import Section from '../../components/Section';

class CourseRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [], // list of all courses to select

      selectedSearch: {}, // selected course (updates on hover)

      loading: true,
    };

    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);

    this.fetchAllCourses = this.fetchAllCourses.bind(this);
  }

  // Called on click of a search suggestion, updates the selected course
  onSelectFromSearch(selection) {
    // Sorts the semesters
    let sortedSemesters = selection.semesters;
    sortedSemesters.sort((a, b) => {
      return a.charAt(1).localeCompare(b.charAt(1));
    });

    this.setState({
      selectedSearch: selection,
    }); // this is where the warning appears :(
  }

  fetchAllCourses = async () => {
    return await Api().get('/courses/getAllCourseOfferings');
  };

  componentDidMount() {
    this.fetchAllCourses()
      .then(response => {
        let courseData = response.data.Response;

        // convert course list to array
        let courseArray = [];
        for (var key in courseData) {
          const course = {
            course_code: key,
            title: courseData[key].title,
            semesters: courseData[key].semesters,
          };
          courseArray.push(course);
        }
        this.setState({ allCourses: courseArray });
      })
      .catch(error => console.log('ERROR', error));
  }

  onEdit() {
    //TODO
  }

  onPhaseOut() {
    //TODO
  }

  render() {
    const { allCourses } = this.state;

    return (
      <div className="admin-panel">
        <Section>
          <SearchBar
            className="selection-search"
            data={allCourses}
            getValue={this.onSelectFromSearch}
          />
          <button className="primary-button" onClick={this.onEdit}>
            Edit
          </button>
          <button className="primary-button" onClick={this.onPhaseOut}>
            Phase out
          </button>
        </Section>
        <Section>
          <MandatoryPanel />
        </Section>
      </div>
    );
  }
}

export default WithHeaderBar(CourseRegistration);
