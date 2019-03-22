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
import { StudentProvider } from './contexts/StudentContext';
import './App.css';

class App extends Component {
  render() {
    return (
      <StudentProvider>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/courseregistration" component={CourseRegistration} />
            <Route path="/curriculumdisplay" component={CurriculumDisplay} />
            <Route path="/Home" component={CourseSuggestion} />
            <Redirect to="/login" />
          </Switch>
        </Router>
      </StudentProvider>
    );
  }
}

export default App;
