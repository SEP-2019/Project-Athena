import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import './App.css';
import CurriculumDisplay from './screens/CurriculumDisplay';

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
      <Router>
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
      </Router>
    );
  }
}

export default App;
