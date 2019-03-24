import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import ErrorPage from './screens/ErrorPage';
import CurriculumDisplay from './screens/CurriculumDisplay';
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/courseregistration" component={CourseRegistration} />
        <Route path="/curriculumdisplay" component={CurriculumDisplay} />
        <Route path="/Home" component={CourseSuggestion} />
        <Route path="/Error" component={ErrorPage} />
        <Route exact path="/" component={Login} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    );
  }
}

export default App;
