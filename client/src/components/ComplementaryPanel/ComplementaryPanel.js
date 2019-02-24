import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SnackbarProvider, withSnackbar } from 'notistack';

import TagList from '../TagList/TagList';
import CourseSuggestionList from '../CourseSuggestionList/CourseSuggestionList';
import './ComplementaryPanel.css';

const TagListWithSnackBar = withSnackbar(TagList);

class ComplementaryPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      tagsAreLoading: true,
      tagError: null,

      suggestions: [],
      suggestionsAreLoading: false,
      suggestionError: null,
    };
  }

  addCheckedProperty(json) {
    return json.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  fetchTags() {
    axios
      .get('http://localhost:3001/tags/getAllTags')
      .then(response =>
        this.setState({
          tags: this.addCheckedProperty(response.data),
          tagsAreLoading: false,
        })
      )
      .catch(tagError => this.setState({ tagError, tagsAreLoading: false }));
  }

  fetchCourseSuggestions(newTag) {
    axios
      .get('http://localhost:3001/courses/getCourseByTag?tag=' + newTag)
      .then(response => {
        this.setState(prevState => ({
          suggestions: [
            ...prevState.suggestions,
            {
              name: newTag,
              courses: this.addCheckedProperty(response.data),
            },
          ],
          suggestionsAreLoading: false,
        }));
      })
      .catch(suggestionError =>
        this.setState({ suggestionError, suggestionsAreLoading: false })
      );
  }

  componentDidMount() {
    this.fetchTags();
  }

  componentWillMount = () => {
    this.loadedCourses = new Set();
    this.checkedTags = new Set();
  };

  updateTagsCheckedState = newTags => {
    this.setState({
      tags: newTags,
      suggestionsAreLoading: true,
    });

    var newSuggestions = [...this.state.suggestions];
    newTags.map(tag => {
      if (tag.checked && !newSuggestions.some(e => e.name === tag.name)) {
        this.fetchCourseSuggestions(tag.name);
      } else if (!tag.checked) {
        var index = newSuggestions.findIndex(e => e.name === tag.name);
        if (index !== -1) {
          newSuggestions.splice(index, 1);
          this.setState({ suggestions: newSuggestions });
        }
      }
      return null;
    });
  };

  updateCoursesCheckedState = (tagName, courseName, newCourses) => {
    var newSuggestions = [...this.state.suggestions];
    var tagIndex = newSuggestions.findIndex(e => e.name === tagName);
    newSuggestions[tagIndex].courses = newCourses;
    this.setState({ suggestions: newSuggestions });
    // console.log(newSuggestions);
  };

  clearSelection = e => {
    e.preventDefault();
    var newSuggestions = [...this.state.suggestions];
    newSuggestions.forEach(function(obj) {
      obj.courses.map(course => {
        if (course.checked) {
          course.checked = false;
          console.log('Uncheck ' + course.course_code);
        }
      });
    });
    this.setState({ suggestions: newSuggestions });
    console.log(this.state.suggestions);
  };

  loadSuggestions = (tag, courses) => {
    const { suggestionError } = this.state;
    return (
      <CourseSuggestionList
        key={tag}
        tag={tag}
        courses={courses}
        loadedCourses={this.loadedCourses}
        updateCoursesCheckedState={this.updateCoursesCheckedState}
        errorMessage={content =>
          suggestionError ? (
            <p className="Error">{suggestionError.message}</p>
          ) : (
            content
          )
        }
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
                errorMessage={content =>
                  tagError ? (
                    <p className="Error">{tagError.message}</p>
                  ) : (
                    content
                  )
                }
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
