import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SnackbarProvider, withSnackbar } from 'notistack';

import TagList from '../TagList/TagList';
import CourseSuggestionList from '../CourseSuggestionList/CourseSuggestionList';
import './ComplementaryPanel.css';

const TagListWithSnackBar = withSnackbar(TagList);
const url = 'http://localhost:3001';

class ComplementaryPanel extends Component {
  state = {
    tags: [],
    tagsAreLoading: true,
    tagError: null,

    suggestions: [],
    suggestionsAreLoading: false,
    suggestionError: null,
    loadedCourses: new Set(),
  };

  addCheckedProperty(data) {
    return data.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  fetchTags = async () => {
    const response = await axios
      .get(`${url}/tags/getAllTags`)
      .catch(tagError => this.setState({ tagError, tagsAreLoading: false }));
    this.setState({
      tags: this.addCheckedProperty(response.data.Response),
      tagsAreLoading: false,
    });
  };

  fetchCourseSuggestions = async newTag => {
    const response = await axios
      .get(`${url}/courses/getCourseByTag?tag=${newTag}`)
      .catch(suggestionError =>
        this.setState({ suggestionError, suggestionsAreLoading: false })
      );
    this.setState(prevState => ({
      suggestions: [
        ...prevState.suggestions,
        {
          name: newTag,
          courses: this.addCheckedProperty(response.data.Response),
        },
      ],
      suggestionsAreLoading: false,
    }));
  };

  componentDidMount() {
    this.fetchTags();
  }

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

  clearSelection = e => {
    e.preventDefault();
    let newSuggestions = [...this.state.suggestions];
    newSuggestions.forEach(function(obj) {
      obj.courses.map(course => {
        if (course.checked) {
          course.checked = false;
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

  displayError = content => {
    const { suggestionError } = this.state;
    return suggestionError ? (
      <p className="Error">{suggestionError.message}</p>
    ) : (
      content
    );
  };

  displayError = (content, error) => {
    return error ? <p className="Error">{error.message}</p> : content;
  };

  loadSuggestions = (tag, courses) => {
    const { suggestionError } = this.state;
    return (
      <CourseSuggestionList
        key={tag}
        tag={tag}
        courses={courses}
        loadedCourses={this.state.loadedCourses}
        updateCoursesCheckedState={this.updateCoursesCheckedState}
        errorMessage={this.displayError}
        error={suggestionError}
      />
    );
  };

  render() {
    const { tagsAreLoading, tags, tagError, suggestions } = this.state;
    return (
      <div className="tab_content">
        <div className="spacer" />
        <div className="tags-container">
          {!tagsAreLoading ? (
            <SnackbarProvider maxSnack={3}>
              <TagListWithSnackBar
                tags={tags}
                clearSelection={this.clearSelection}
                checkedTags={this.checkedTags}
                updateTagsCheckedState={this.updateTagsCheckedState}
                errorMessage={this.displayError}
                error={tagError}
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
