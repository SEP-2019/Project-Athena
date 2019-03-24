import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import CurriculumDisplay from './screens/CurriculumDisplay';
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route
          path="/login"
          // render={props => <Login setEmail={this.setEmail} {...props} />}
          render={props => <Login {...props} />}
        />
        <Route
          path="/courseregistration"
          render={props => (
            <CourseRegistration
              // responseEmail={this.state.responseEmail}
              {...props}
            />
          )}
        />
        <Route
          path="/curriculumdisplay"
          render={props => (
            <CurriculumDisplay
              // responseEmail={this.state.responseEmail}
              {...props}
            />
          )}
        />
        <Route
          path="/Home"
          render={props => (
            <CourseSuggestion
              // responseEmail={this.state.responseEmail}
              {...props}
            />
          )}
        />
        <Redirect to="/login" />
      </Switch>
    );
  }
}

export default App;
