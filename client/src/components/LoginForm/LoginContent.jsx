import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import axios from 'axios';
import './LoginForm.css';

const LOGIN_URL = 'http://localhost:3001/users/login';

class LoginContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    if (this.isInputValid()) {
      //Send Request
      axios
        .post(LOGIN_URL, {
          username: this.state.username,
          password: this.state.password,
        })
        .then(response => {
          // Got good response
          console.log(response);
          // TODO: change page
        })
        .catch(loginError => {
          // Invalid login
          console.log(loginError);
          var error = loginError.response.data.ErrorMessage;
          if (
            error === 'Password length must be between 8 and 64' ||
            error === 'User does not exist' ||
            error === 'Username must be alphanumeric'
          ) {
            this.setInvalidCredentials();
          } else {
            this.setError(error);
          }
        });
    }
  }

  isInputValid() {
    var id = this.state.username;
    var password = this.state.password;
    // Check if username & password are empty
    if (this.isEmpty(id)) {
      this.setError('Student ID is required.');
      return false;
    } else if (this.isEmpty(password)) {
      this.setError('Password is required.');
      return false;
    } else if (!/^\d+$/.test(id)) {
      // Invalid Student ID (contains letters)
      this.setInvalidCredentials();
      return false;
    } else if (password.length < 8 || password.length > 64) {
      // Password length out of range
      this.setInvalidCredentials();
      return false;
    }

    // No error
    this.setError('');
    return true;
  }

  setError(message) {
    document.getElementById('error-msg').innerHTML = message;
  }

  setInvalidCredentials() {
    this.setError('Invalid crendentials. Please try again.');
  }

  isEmpty(value) {
    return !value;
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Section className="form" flexDirection="column">
        <p className="error" id="error-msg" />
        <EditText
          required
          label="Student ID"
          id="username-input"
          type="username"
          defaultValue={this.state.username}
          onChange={this.handleInputChange}
        />
        <EditText
          required
          label="Password"
          id="password-input"
          type="password"
          defaultValue={this.state.password}
          onChange={this.handleInputChange}
        />
        <button className="primary-button" onClick={this.onLogin}>
          Log in
        </button>
        <button className="secondary-button" onClick={this.props.handleChange}>
          Sign up
        </button>
      </Section>
    );
  }
}

export default LoginContent;
