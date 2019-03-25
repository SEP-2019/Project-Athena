import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import ErrorPage from './screens/ErrorPage';
import CurriculumDisplay from './screens/CurriculumDisplay';
import './App.css';
import AdminPanel from './screens/AdminPanel/AdminPanel';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/courseRegistration" component={CourseRegistration} />
        <Route path="/curriculumDisplay" component={CurriculumDisplay} />
        <Route path="/courseSuggestions" component={CourseSuggestion} />
        <Route path="/Error" component={ErrorPage} />
        <Route path="/Admin" component={AdminPanel} />
        <Route exact path="/" component={Login} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    );
  }
}

export default App;
