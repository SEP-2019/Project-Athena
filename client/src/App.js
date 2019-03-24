import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import CourseRegistration from './screens/CourseRegistration';
import CourseSuggestion from './screens/CourseSuggestion';
import Login from './screens/Login';
import ErrorPage from './screens/ErrorPage';
import CurriculumDisplay from './screens/CurriculumDisplay';
import { StudentProvider } from './contexts/StudentContext';
import history from './history';
import './App.css';

class App extends Component {
  render() {
    return (
      <StudentProvider>
        <Router history={history}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/courseregistration" component={CourseRegistration} />
            <Route path="/curriculumdisplay" component={CurriculumDisplay} />
            <Route path="/Home" component={CourseSuggestion} />
            <Route path="/Error" component={ErrorPage} />
            <Redirect to="/login" />
          </Switch>
        </Router>
      </StudentProvider>
    );
  }
}

export default App;
