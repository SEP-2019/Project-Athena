import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HeaderBar from "./components/HeaderBar/HeaderBar";
import CourseRegistration from "./CourseRegistration/CourseRegistration";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="app">
        <HeaderBar />
        <div className="app-content">
          <Router>
            <Fragment>
              <Route exact path="/" render={ () => 
                <p>Hello World!</p>
              }/>
              <Route path="/courseregistration" component={ CourseRegistration }/>            
            </Fragment>
          </Router>          
        </div>
      </div>
    );
  }
}

export default App;
