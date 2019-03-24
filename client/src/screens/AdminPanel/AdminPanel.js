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
import { SnackbarProvider, withSnackbar } from 'notistack';
import AdminForm from '../../components/AdminForm/AdminForm';

const TagListWithSnackBar = withSnackbar(TagList);

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [], // list of all courses to select
      selectedSearch: {}, // selected course (updates on hover)
      loading: true,
      tags: [],
      placeHolder: 'Type a course number',
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

  fetchTagsByCourse = async () => {
    const response = await Api()
      .get(
        `tags/getTagByCourse?studentID=${this.state.selectedSearch.course_code}`
      )
      .catch(error => {
        // RedirectError(error); //TODO
      });
    if (response) {
      //TODO go through this.state.tags and mark checked to true for the tags in response.data.Response
      // this.setState({
      //   tags: this.addCheckedProperty(response.data.Response),
      //   tagsAreLoading: false,
      // });
    }
  };

  onEditView() {
    if (typeof this.state.selectedSearch.course_code === 'undefined') {
      console.log('empty bar! Dont switch view');
      this.setState({ placeHolder: 'Select a course to edit!' });
    }
    //TODO
    else this.handleSwitchView('edit');
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({ [name]: value });
    console.log(name, ' and ', value);
  }

  updateTagsCheckedState = newTags => {
    this.setState({ tags: newTags });
  };

  onEdit() {
    //TODO
  }

  onAdd() {
    //TODO
    // Api()
    //   .post('/courses/addCompletedCourses', completedCourses)
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(error => console.log('ERROR', error));
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

            <AdminForm
              selectedSearch={this.state.selectedSearch}
              handleInputChange={this.handleInputChange}
            />

            <div className="tags-container">
              {!tagsAreLoading ? (
                <SnackbarProvider maxSnack={3}>
                  <TagListWithSnackBar
                    tags={tags}
                    applySelection={this.applySelection}
                    checkedTags={new Set()}
                    updateTagsCheckedState={this.updateTagsCheckedState}
                  />
                </SnackbarProvider>
              ) : (
                <h3>Loading tags...</h3>
              )}
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

            <AdminForm selectedSearch={{}} />

            <div className="tags-container">
              {!tagsAreLoading ? (
                <SnackbarProvider maxSnack={3}>
                  <TagListWithSnackBar
                    tags={tags}
                    applySelection={this.applySelection}
                    checkedTags={new Set()}
                    updateTagsCheckedState={this.updateTagsCheckedState}
                  />
                </SnackbarProvider>
              ) : (
                <h3>Loading tags...</h3>
              )}
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
            placeHolder={this.state.placeHolder}
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
