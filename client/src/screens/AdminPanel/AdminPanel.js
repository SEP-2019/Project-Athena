import React, { Component } from 'react';
import Api from '../../services/Api';
import PropTypes from 'prop-types';
import './AdminPanel.css';

import SearchBar from '../../components/SearchBar';

import MandatoryPanel from '../../components/MandatoryPanel/MandatoryPanel';
import Section from '../../components/Section';
import history from '../../history';
import EditText from '../../components/EditText';
import TagList from '../../components/TagList/TagList';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [], // list of all courses to select
      selectedSearch: {}, // selected course (updates on hover)
      loading: true,
      tags: [],
    };

    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);
    this.fetchAllCourses = this.fetchAllCourses.bind(this);
    this.onEditView = this.onEditView.bind(this);
    this.handleSwitchView = this.handleSwitchView.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchTags = this.fetchTags.bind(this);
  }

  // Called on click of a search suggestion, updates the selected course
  onSelectFromSearch(selection) {
    this.setState({
      selectedSearch: selection,
    }); // this is where the warning appears :(
  }

  fetchAllCourses = async () => {
    return await Api().get('/courses/getAllCourses');
  };

  componentDidMount() {
    //TODO put this in to prevent going in admin page without logging in
    // if (this.props.location.isAdmin !== true) history.push('/login');

    this.fetchAllCourses()
      .then(response => {
        let courseData = response.data.Response;

        this.setState({ allCourses: courseData });
      })
      .catch(error => console.log('ERROR', error));

    this.fetchTags();
  }

  addCheckedProperty(data) {
    return data.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  handleSwitchView = view => {
    this.setState({
      view: view,
    });
  };

  fetchTags = async () => {
    const response = await Api()
      .get(`tags/getAllTags`)
      .catch(error => {
        // RedirectError(error); //TODO
      });
    if (response) {
      this.setState({
        tags: this.addCheckedProperty(response.data.Response),
        tagsAreLoading: false,
      });
    }
  };

  onEditView() {
    if (this.state.selectedSearch.course_code === '') {
      console.log('empty bar! Dont switch view');
    }
    //TODO
    else this.handleSwitchView('edit');
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({ [name]: value });
  }

  updateTagsCheckedState = newTags => {
    console.log(newTags)
    this.setState({ tags: newTags });
  };

  renderTagsBox = (props) => {
    return !props.tagsAreLoading ? (
      <TagList
        hasButtons={false}
        tags={props.tags}
        applySelection={this.applySelection}
        checkedTags={new Set()}
        updateTagsCheckedState={this.updateTagsCheckedState}
      />
    ) : (
      <h3>Loading tags...</h3>
    )
  }

  render() {
    const { allCourses } = this.state;
    const tagsAreLoading = this.state.tagsAreLoading;
    const tags = this.state.tags;

    let view;
    switch (this.state.view) {
      case 'list':
        view = <MandatoryPanel />;
        break;
      case 'edit':
        view = (
          <Section className="form" flexDirection="column">
            <span className="error" id="error-msg">
              {this.state.errorMessage}
            </span>
            <Section className="subform" flexDirection="row">
              <EditText
                required
                label="Course code"
                id="course-code-input"
                type="text"
                name="course code"
                defaultValue={this.state.selectedSearch.course_code}
                onChange={this.handleInputChange}
                // error={this.state.usernameError}
              />
            </Section>
            <EditText
              required
              label="Title"
              id="title-input"
              type="text"
              name="title"
              defaultValue={this.state.selectedSearch.title}
              onChange={this.handleInputChange}
              // error={this.state.usernameError}
            />
            <EditText
              required
              label="Description"
              id="desc-input"
              type="text" //TODO make it multiline?
              name="desc"
              defaultValue={this.state.selectedSearch.description}
              onChange={this.handleInputChange}
              // error={this.state.emailError}
            />
            <Section className="subform" flexDirection="row">
              <EditText
                required
                label="Number of credits"
                id="credits-input"
                type="number"
                name="credits"
                defaultValue={this.state.selectedSearch.credits}
                onChange={this.handleInputChange}
                // error={this.state.passwordError}
              />
            </Section>

            <div className="tags-container">
            <this.renderTagsBox
                tags={tags}
                tagsAreLoading={tagsAreLoading}
              />
            </div>

            {/* Buttons */}
            <button className="primary-button" onClick={this.onEdit}>
              Edit course
            </button>
          </Section>
        );
        break;
      case 'add':
        view = (
          <Section className="form" flexDirection="column">
            <span className="error" id="error-msg">
              {this.state.errorMessage}
            </span>
            <Section className="subform" flexDirection="row">
              <EditText
                required
                label="Course code"
                id="course-code-input"
                type="text"
                name="course code"
                defaultValue={this.state.course_code}
                onChange={this.handleInputChange}
                // error={this.state.usernameError}
              />
            </Section>
            <EditText
              required
              label="Title"
              id="title-input"
              type="text"
              name="title"
              defaultValue={this.state.course_code}
              onChange={this.handleInputChange}
              // error={this.state.usernameError}
            />
            <EditText
              required
              label="Description"
              id="desc-input"
              type="text" //TODO make it multiline?
              name="desc"
              defaultValue={this.state.desc}
              onChange={this.handleInputChange}
              // error={this.state.emailError}
            />
            <Section className="subform" flexDirection="row">
              <EditText
                required
                label="Number of credits"
                id="credits-input"
                type="number"
                name="credits"
                defaultValue={this.state.credits}
                onChange={this.handleInputChange}
                // error={this.state.passwordError}
              />
            </Section>

            <div className="tags-container">
              <this.renderTagsBox
                tags={tags}
                tagsAreLoading={tagsAreLoading}
              />
            </div>

            {/* Buttons */}
            <button className="primary-button" onClick={this.onAdd}>
              Add course
            </button>
          </Section>
        );
        break;
    }

    return (
      <div className="admin-panel">
        <Section>
          <SearchBar
            className="selection-search"
            data={allCourses}
            getValue={this.onSelectFromSearch}
          />
          <button
            className="primary-button"
            onClick={() => this.handleSwitchView('list')}
          >
            View List
          </button>
          <button
            className="primary-button"
            onClick={() => this.handleSwitchView('add')}
          >
            Add
          </button>
          <button className="primary-button" onClick={this.onEditView}>
            Edit
          </button>
        </Section>
        <Section>{view}</Section>
      </div>
    );
  }
}

TagList.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default AdminPanel;
