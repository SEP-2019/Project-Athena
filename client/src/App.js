import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import ErrorPage from './screens/ErrorPage';
import CurriculumDisplay from './screens/CurriculumDisplay';
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
  }

  render() {
    // TEMPORARY place to set student id, move this inside the login functionality
    const cookies = new Cookies();
    cookies.set('studentId', 123321123, { path: '/' });

    return (
      <Switch>
        <Route
          path="/login"
          render={props => <Login setEmail={this.setEmail} {...props} />}
        />
        <Route path="/courseregistration" component={CourseRegistration} />
        <Route path="/curriculumdisplay" component={CurriculumDisplay} />
        <Route path="/Home" component={CourseSuggestion} />
        <Route path="/Error" component={ErrorPage} />
        <Redirect to="/login" />
      </Switch>
    );
  }
}

export default App;
