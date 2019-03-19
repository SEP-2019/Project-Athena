import React, { Component } from 'react';

// IMPORT the service you would like to call
import UserService from '../../services/UserService'

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
