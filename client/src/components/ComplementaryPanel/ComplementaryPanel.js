import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SnackbarProvider, withSnackbar } from 'notistack';

import TagList from '../TagList/TagList';
import CourseSuggestionList from '../CourseSuggestionList/CourseSuggestionList';
import './ComplementaryPanel.css';

const TagListWithSnackBar = withSnackbar(TagList);
const url = 'http://localhost:3001';
const sid = '123456789';

class ComplementaryPanel extends Component {
  state = {
    tags: [],
    tagsAreLoading: true,

    suggestions: [],
    suggestionsAreLoading: false,
    loadedCourses: new Set(),
  };

  addCheckedProperty(data) {
    return data.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  fetchTags = async () => {
    const response = await axios.get(`${url}/tags/getAllTags`).catch(error => {
      console.error(error);
      this.setState({ tagsAreLoading: false });
    });
    if (response) {
      this.setState({
        tags: this.addCheckedProperty(response.data.Response),
        tagsAreLoading: false,
      });
    }
  };

  fetchCourseSuggestions = async newTag => {
    const response = await axios
      .get(`${url}/courses/getCourseByTag?tag=${newTag}&studentID=${sid}`)
      .catch(error => {
        console.error(error);
        this.setState({ suggestionsAreLoading: false });
      });
    if (response) {
      this.setState(prevState => ({
        suggestions: [
          ...prevState.suggestions,
          {
            name: newTag,
            courses: response.data.Response,
          },
        ],
        suggestionsAreLoading: false,
      }));
    }
  };

  componentDidMount = () => {
    this.fetchTags();
    // TODO: fetchUserData to get CompletedCourses
  };

  componentWillMount = () => {
    this.checkedTags = new Set();
  };

  updateTagsCheckedState = newTags => {
    this.setState({
      tags: newTags,
      suggestionsAreLoading: true,
    });

    let newSuggestions = [...this.state.suggestions];
    newTags.map(tag => {
      if (tag.checked && !newSuggestions.some(e => e.name === tag.name)) {
        this.fetchCourseSuggestions(tag.name);
      } else if (!tag.checked) {
        const index = newSuggestions.findIndex(e => e.name === tag.name);
        if (index !== -1) {
          newSuggestions.splice(index, 1);
          this.setState({ suggestions: newSuggestions });
        }
      }
      return null;
    });
  };

  updateCoursesCheckedState = (tagName, newCourses) => {
    let newSuggestions = [...this.state.suggestions];
    const tagIndex = newSuggestions.findIndex(e => e.name === tagName);
    newSuggestions[tagIndex].courses = newCourses;
    this.setState({ suggestions: newSuggestions });
  };

  clearSelection = () => {
    let newSuggestions = [...this.state.suggestions];
    newSuggestions.forEach(function(obj) {
      obj.courses.map(course => {
        if (course.desired) {
          course.desired = false;
        }
        return null;
      });
    });
    const newSet = new Set();
    this.setState({
      suggestions: newSuggestions,
      loadedCourses: newSet,
    });
  };

  applySelection = () => {
    console.log(this.state.suggestions);
    // TODO: POST request to save
  };

  loadSuggestions = (tag, courses) => {
    return (
      <CourseSuggestionList
        key={tag}
        tag={tag}
        courses={courses}
        loadedCourses={this.state.loadedCourses}
        updateCoursesCheckedState={this.updateCoursesCheckedState}
      />
    );
  };

  render() {
    const { tagsAreLoading, tags, suggestions } = this.state;
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="tags-container">
          {!tagsAreLoading ? (
            <SnackbarProvider maxSnack={3}>
              <TagListWithSnackBar
                tags={tags}
                clearSelection={this.clearSelection}
                applySelection={this.applySelection}
                checkedTags={this.checkedTags}
                updateTagsCheckedState={this.updateTagsCheckedState}
              />
            </SnackbarProvider>
          ) : (
            <h3>Loading the tags...</h3>
          )}
        </div>
        <div className="spacer" />
        <div className="courses-container">
          {suggestions.length > 0 ? (
            suggestions.map(elem =>
              this.loadSuggestions(elem.name, elem.courses)
            )
          ) : (
            <p>
              You did not select any interest. Please select at least one
              interest from the list.
            </p>
          )}
        </div>
        <div className="spacer" />
      </div>
    );
  }
}

TagList.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default ComplementaryPanel;
