import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import CurriculumDisplay from './screens/CurriculumDisplay';
import { StudentProvider } from './contexts/StudentContext';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseEmail: 'test',
    };
    this.setEmail = this.setEmail.bind(this);
  }

  setEmail(email) {
    this.setState({ responseEmail: email });
    console.log('THE EMAIL WAS SET: ', email);
  }

  render() {
    return (
      <StudentProvider>
        <Switch>
          <Route
            path="/login"
            render={props => <Login setEmail={this.setEmail} {...props} />}
          />
          <Route
            path="/courseregistration"
            render={props => (
              <CourseRegistration
                responseEmail={this.state.responseEmail}
                {...props}
              />
            )}
          />
          <Route
            path="/curriculumdisplay"
            render={props => (
              <CurriculumDisplay
                responseEmail={this.state.responseEmail}
                {...props}
              />
            )}
          />
          <Route
            path="/Home"
            render={props => (
              <CourseSuggestion
                responseEmail={this.state.responseEmail}
                {...props}
              />
            )}
          />
          <Redirect to="/login" />
        </Switch>
      </StudentProvider>
    );
  }
}

export default App;
