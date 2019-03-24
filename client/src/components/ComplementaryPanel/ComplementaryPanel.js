import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider, withSnackbar } from 'notistack';

import Api from '../../services/Api';
import TagList from '../TagList/TagList';
import RedirectError from '../RedirectError/RedirectError';
import CourseSuggestionList from '../CourseSuggestionList/CourseSuggestionList';
import './ComplementaryPanel.css';

const TagListWithSnackBar = withSnackbar(TagList);

class ComplementaryPanel extends Component {
  state = {
    tags: [],
    tagsAreLoading: true,

    suggestions: [],
    selectedCourses: new Set(),
  };

  addCheckedProperty(data) {
    return data.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  addDesiredCourses = async courses => {
    await Api()
      .post(`/courses/updateDesiredCourse`, {
        student_id: this.props.sid,
        courses: courses,
      })
      .catch(error => {
        RedirectError(error);
      });
  };

  fetchTags = async () => {
    const response = await Api()
      .get(`tags/getAllTags`)
      .catch(error => {
        RedirectError(error);
      });
    if (response) {
      this.setState({
        tags: this.addCheckedProperty(response.data.Response),
        tagsAreLoading: false,
      });
    }
  };

  fetchCourseSuggestions = async newTag => {
    const response = await Api()
      .get(`courses/getCourseByTag?tag=${newTag}&studentID=${this.props.sid}`)
      .catch(error => {
        RedirectError(error);
      });
    if (response) {
      const courses = response.data.Response;
      courses.forEach(this.populateDesiredCourses);
      this.setState(prevState => ({
        suggestions: [
          ...prevState.suggestions,
          { name: newTag, courses: courses },
        ],
      }));
    }
  };

  componentDidMount = () => {
    this.fetchTags();
  };

  componentWillMount = () => {
    this.checkedTags = new Set();
    this.loadedCourses = new Set();
  };

  updateTagsCheckedState = newTags => {
    this.setState({ tags: newTags });
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

  populateDesiredCourses = course => {
    const code = course.course_code;
    if (course.desired === 1) {
      this.loadedCourses.add(code);
    } else if (this.loadedCourses.has(code)) {
      this.loadedCourses.delete(code);
    }
    this.setState({ selectedCourses: new Set(this.loadedCourses) });
  };

  hasChange = () => {
    let as = this.loadedCourses;
    let bs = this.state.selectedCourses;
    if (as.size !== bs.size) return true;
    for (var a of as) if (!bs.has(a)) return true;
    return false;
  };

  applySelection = () => {
    if (this.hasChange()) {
      this.loadedCourses = new Set(this.state.selectedCourses);
      let course_array = [...this.loadedCourses];
      this.addDesiredCourses(course_array);
      return true;
    }
    return false;
  };

  loadSuggestions = (tag, courses) => {
    return (
      <CourseSuggestionList
        key={tag}
        tag={tag}
        courses={courses}
        selectedCourses={this.state.selectedCourses}
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
                applySelection={this.applySelection}
                checkedTags={this.checkedTags}
                updateTagsCheckedState={this.updateTagsCheckedState}
              />
            </SnackbarProvider>
          ) : (
            <h3>Loading filter tags...</h3>
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
              You did not select any filter. Please select a filter to see the
              courses.
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
