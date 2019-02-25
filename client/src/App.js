import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CourseRegistration from './screens/CourseRegistration';
import Login from './screens/Login';
import './App.css';
import CurriculumDisplay from './screens/CurriculumDisplay';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/courseregistration" component={CourseRegistration} />
          <Route path="/curriculumdisplay" component={CurriculumDisplay} />
        </Switch>
      </Router>
    );
  }
}

export default App;
