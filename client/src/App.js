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
import CurriculumDisplay from './screens/CurriculumDisplay';
import Cookies from 'universal-cookie';
import './App.css';

class App extends Component {
  render() {
    // TEMPORARY place to set student id, move this inside the login functionality
    const cookies = new Cookies();
    cookies.set('studentId', 123321123, { path: '/' });

    return (
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/courseregistration" component={CourseRegistration} />
            <Route path="/curriculumdisplay" component={CurriculumDisplay} />
            <Route path="/Home" component={CourseSuggestion} />
            <Redirect to="/login" />
          </Switch>
        </Router>
    );
  }
}

export default App;
