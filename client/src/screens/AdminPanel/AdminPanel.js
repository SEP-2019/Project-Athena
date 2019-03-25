import React, { Component } from 'react';
import Api from '../../services/Api';
import PropTypes from 'prop-types';

import './AdminPanel.css';
import history from '../../history';
import SearchBar from '../../components/SearchBar';
import MandatoryPanel from '../../components/MandatoryPanel/MandatoryPanel';
import Section from '../../components/Section';
import TagList from '../../components/TagList/TagList';
import AdminForm from '../../components/AdminForm/AdminForm';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [], // list of all courses to select
      selectedSearch: {}, // selected course (updates on hover)
      courseToEdit: {},
      loading: true,
      tags: [],
      inc: 0,
      tagsAreLoading: true,
      checkedTagsSet: new Set(),
      placeHolder: 'Type a course number',
      disableEdit: true,
    };

    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);
    this.fetchAllCourses = this.fetchAllCourses.bind(this);
    this.updateCourseList = this.updateCourseList.bind(this);
    this.onEditView = this.onEditView.bind(this);
    this.handleSwitchView = this.handleSwitchView.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchTags = this.fetchTags.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.fetchTagsByCourse = this.fetchTagsByCourse.bind(this);
    this.renderTagsBox = this.renderTagsBox.bind(this);
    this.checkInput = this.checkInput.bind(this);
  }

  // Called on click of a search suggestion, updates the selected course
  onSelectFromSearch(selection) {
    if (Object.keys(selection).length > 0) {
      this.setState({
        selectedSearch: selection,
        disableEdit: false,
      });
    } else {
      this.setState({
        selectedSearch: {},
        disableEdit: true,
      });
      if (this.state.view === 'edit') this.handleSwitchView('');
    }
  }

  fetchAllCourses = async () => {
    return await Api().get('/courses/getAllCourses');
  };

  updateCourseList() {
    this.fetchAllCourses()
      .then(response => {
        let courseData = response.data.Response;
        this.setState({ allCourses: courseData });
      })
      .catch(error => console.log('ERROR', error));
  }

  componentDidMount() {
    //TODO put this in to prevent going in admin page without logging in
    if (this.props.location.isAdmin !== true) history.push('/login');

    this.updateCourseList();
    this.fetchTags();
  }

  addCheckedProperty(data) {
    return data.map(obj => {
      obj.checked = false;
      return obj;
    });
  }

  handleSwitchView = view => {
    this.setState(
      {
        /*
      in the case of edit, only set the tagsAreLoading flag to false once the checked tags are fetched
      this is because the TagList component sets the checked tags in componentWillMount() which is only
      called on the first render. In the case of edit, the checked tags for the current course need to be fetched
      before the tags list can be rendered
      */
        tagsAreLoading: view === 'edit',
        inc: this.state.inc + 1,
        checkedTagsSet: new Set(),
        view: view,
      },
      () => {
        if (view === 'add') {
          // when adding a new course, clear the currently selected tags
          let newTags = this.state.tags;
          newTags.map(t => (t.checked = false));
          this.setState({
            tags: newTags,
            courseToEdit: {
              course_code: '',
              title: '',
              description: '',
              credits: '',
            },
          });
        }
      }
    );
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
      });
    }
  };

  fetchTagsByCourse = async () => {
    const response = await Api()
      .get(
        `courses/getTagByCourse?course_code=${
          this.state.selectedSearch.course_code
        }`
      )
      .catch(error => {
        // RedirectError(error); //TODO
      });
    if (response) {
      let courseTags = response.data.Response;
      let checkedTags = this.state.tags;

      // check the tags that are fetched from the endpoint
      checkedTags.map(
        tag => (tag.checked = courseTags.some(t => t.tag_name === tag.name))
      );

      this.setState({
        tags: checkedTags,
        tagsAreLoading: false,
        checkedTagsSet: new Set(
          this.state.tags.filter(t => t.checked === true).map(t => t.name)
        ),
      });
    }
  };

  onEditView() {
    if (typeof this.state.selectedSearch.course_code === 'undefined') {
      this.setState({ placeHolder: 'Select a course to edit!' });
    } else {
      this.setState(prevState => ({
        courseToEdit: prevState.selectedSearch,
      }));
      this.fetchTagsByCourse();
      this.handleSwitchView('edit');
    }
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;

    // in the case of the TagCheckBox component, the value cannot be parsed directly, but rather
    // comes from the "checked" property of the event
    const newValue =
      name === 'phased_out' ? event.target && event.target.checked : value;

    this.setState(prevState => ({
      courseToEdit: {
        ...prevState.courseToEdit,
        [name]: newValue,
      },
    }));
  }

  updateTagsCheckedState = newTags => {
    this.setState({ tags: newTags });
  };

  checkInput() {
    if (!/^[a-z]{4} \d{3}$/i.test(this.state.courseToEdit.course_code)) {
      console.error('invalid course code');
      this.setState({ errorMessage: 'Invalid course code format' });
      return true;
    }
    if (
      this.state.courseToEdit.credits > 9 ||
      this.state.courseToEdit.credits < 0
    ) {
      console.error('invalid credits');
      this.setState({ errorMessage: 'Credits must be between 0 and 9' });
      return true;
    }
    if (this.state.courseToEdit.title.length > 512) {
      console.error('invalid title');
      this.setState({
        errorMessage: 'Title cannot be longer than 512 characters',
      });
      return true;
    }
    if (this.state.courseToEdit.description.length > 1000) {
      console.error('invalid description');
      this.setState({
        errorMessage: 'Description cannot be longer than 1000 characters',
      });
      return true;
    }
    if (
      !this.state.courseToEdit.title ||
      !this.state.courseToEdit.course_code ||
      !this.state.courseToEdit.description ||
      !this.state.courseToEdit.credit
    ) {
      console.error('missing field');
      this.setState({
        errorMessage: 'You must fill in all fields',
      });
      return true;
    }
    return false;
  }

  onEdit() {
    console.log(this.state.courseToEdit);
    if (this.checkInput()) return;

    let updatedCourse = {
      course: this.state.courseToEdit.course_code,
      new_title: this.state.courseToEdit.title,
      new_description: this.state.courseToEdit.description,
      new_credits: this.state.courseToEdit.credits,
      new_tags: Array.from(this.state.checkedTagsSet),
      phased_out: this.state.courseToEdit.phased_out,
    };

    console.log(updatedCourse);

    Api()
      .post('/courses/updateCourse', updatedCourse)
      .then(res => {
        console.log(res);
        this.updateCourseList();
      })
      .catch(error => console.log('ERROR', error));
  }

  onAdd() {
    console.log(this.state.courseToEdit);
    if (this.checkInput()) return;

    let newCourse = {
      courseCode: this.state.courseToEdit.course_code,
      title: this.state.courseToEdit.title,
      departement: this.state.courseToEdit.course_code.substring(0, 4),
      phasedOut: this.state.courseToEdit.phased_out,
      description: this.state.courseToEdit.description,
      credits: this.state.courseToEdit.credits,
    };

    Api()
      .post('/courses/createCourse', newCourse)
      .then(res => {
        console.log(res);
        let newTags = {
          course: this.state.courseToEdit.course_code,
          tag: Array.from(this.state.checkedTagsSet),
        };

        console.log(newTags);

        Api()
          .post('/tags/assignTagsToCourse', newTags)
          .then(res => console.log(res))
          .catch(error => console.log('ERROR', error));
      })
      .then(res => {
        // get the list of courses to update it with the course that was just added
        this.updateCourseList();
      })
      .catch(error => console.log('ERROR', error));
  }

  renderTagsBox(props) {
    return !props.tagsAreLoading ? (
      <TagList
        hasButtons={false}
        refreshChecks={true}
        tags={this.state.tags}
        applySelection={this.applySelection}
        checkedTags={this.state.checkedTagsSet}
        updateTagsCheckedState={this.updateTagsCheckedState}
      />
    ) : (
      <h3>Loading tags...</h3>
    );
  }

  render() {
    const { allCourses } = this.state;
    const tagsAreLoading = this.state.tagsAreLoading;
    const tags = this.state.tags;

    let view;
    switch (this.state.view) {
      case 'list':
        view = (
          <div className="view_list">
            <MandatoryPanel url={'courses/getAllCourses'} />
          </div>
        );
        break;
      case 'edit':
        view = (
          <Section className="panel_form" flexDirection="column">
            <span className="error" id="error-msg">
              {this.state.errorMessage}
            </span>

            <AdminForm
              selectedCourse={this.state.courseToEdit}
              handleInputChange={this.handleInputChange}
              view={this.state.view === 'edit'}
            />

            <div className="tags-container">
              <this.renderTagsBox
                tags={this.state.tags}
                tagsAreLoading={tagsAreLoading}
              />
            </div>

            <button className="primary-button" onClick={this.onEdit}>
              Edit course
            </button>
          </Section>
        );
        break;
      case 'add':
        view = (
          <Section className="panel_form" flexDirection="column">
            <span className="error" id="error-msg">
              {this.state.errorMessage}
            </span>

            <AdminForm
              selectedCourse={this.state.courseToEdit}
              handleInputChange={this.handleInputChange}
              view={this.state.view === 'edit'}
            />

            <div className="tags-container">
              <this.renderTagsBox tags={tags} tagsAreLoading={tagsAreLoading} />
            </div>

            {/* Buttons */}
            <button className="primary-button" onClick={this.onAdd}>
              Add course
            </button>
          </Section>
        );
        break;
      default:
        view = <div />;
    }

    return (
      <div className="admin-panel">
        <div className="top_bar">
          <a>Administrator Panel</a>
        </div>
        <Section className="action_bar">
          <div className="selection_search">
            <SearchBar
              data={allCourses}
              getValue={this.onSelectFromSearch}
              placeholder={this.state.placeHolder}
            />
          </div>
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
          <button
            className="primary-button edit"
            onClick={this.onEditView}
            disabled={this.state.disableEdit}
          >
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
