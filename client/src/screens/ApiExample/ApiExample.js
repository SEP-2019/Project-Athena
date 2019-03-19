import React, { Component } from 'react';

// Import the service you would like to call
import UserService from '../../services/UserService'
import CourseService from '../../services/CourseService'
import CurriculumService from '../../services/CurriculumService'
import TagService from '../../services/TagService'

class ApiExample extends Component {

  postUser(){
    UserService.post("dingding132","werakfjs","dongwen.wang@cool.com", "260689443")
  }
  getUser(){
    UserService.get("260689443")
  }

  render() {
    return (
      <button onclick="postUser()">
        Create a new user
      </button>
    );
  }
}

export default ApiExample;
