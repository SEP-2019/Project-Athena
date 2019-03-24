import React, { Component } from 'react';
import Api from '../../services/Api';
import PropTypes from 'prop-types';
import './AdminPanel.css';

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
      placeHolder: 'Type a course number',
      disableEdit: true,
    };

    this.onSelectFromSearch = this.onSelectFromSearch.bind(this);
    this.fetchAllCourses = this.fetchAllCourses.bind(this);
    this.onEditView = this.onEditView.bind(this);
    this.handleSwitchView = this.handleSwitchView.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchTags = this.fetchTags.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  // Called on click of a search suggestion, updates the selected course
  onSelectFromSearch(selection) {
    if (Object.keys(selection).length > 0) {
      this.setState({
        selectedSearch: selection,
      }); // this is where the warning appears :(
    } else {
      this.setState({
        selectedSearch: {},
      });
      if (this.state.view === 'edit') this.handleSwitchView('');
    }
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
    } else {
      this.setState(prevState => ({
        courseToEdit: prevState.selectedSearch,
      }));
      this.handleSwitchView('edit');
    }
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState(prevState => ({
      courseToEdit: {
        ...prevState.courseToEdit,
        [name]: value,
      },
    }));
  }

  updateTagsCheckedState = newTags => {
    console.log(newTags);
    this.setState({ tags: newTags });
  };

  onEdit() {
    console.log(this.state.courseToEdit);
    //TODO
    // Api()
    //   .post('/courses/addCompletedCourses', completedCourses)
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(error => console.log('ERROR', error));
  }

  onAdd() {
    console.log(this.state.courseToEdit);
    if (!/^[a-z]{4} \d{3}$/i.test(this.state.courseToEdit.course_code)) {
      //TODO
      console.log('invalid course code');
    }

    //TODO
    let newCourse = {
      courseCode: 'ECSE 428',
      title: 'Software Engineering Practice',
      departement: 'ECSE',
      phasedOut: '0',
      description: 'Practice in software',
      credits: 3,
    };

    Api()
      .post('/courses/createCourse', newCourse)
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log('ERROR', error));
  }

  renderTagsBox = props => {
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
    );
  };

  render() {
    const { allCourses } = this.state;
    const tagsAreLoading = this.state.tagsAreLoading;
    const tags = this.state.tags;

    let view;
    switch (this.state.view) {
      case 'list':
        view = <MandatoryPanel url={'courses/getAllCourses'} />;
        break;
      case 'edit':
        view = (
          <Section className="form" flexDirection="column">
            <span className="error" id="error-msg">
              {this.state.errorMessage}
            </span>

            <AdminForm
              selectedCourse={this.state.courseToEdit}
              handleInputChange={this.handleInputChange}
            />

            <div className="tags-container">
              <this.renderTagsBox tags={tags} tagsAreLoading={tagsAreLoading} />
            </div>

            {/* Buttons */}
            <button
              className="primary-button"
              onClick={this.onEdit}
              disabled={this.state.disableEdit}
            >
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

            <AdminForm
              selectedCourse={{}}
              handleInputChange={this.handleInputChange}
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
        <Section>
          <SearchBar
            className="selection-search"
            data={allCourses}
            getValue={this.onSelectFromSearch}
            placeholder={this.state.placeHolder}
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
