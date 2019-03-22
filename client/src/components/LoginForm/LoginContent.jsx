import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import axios from 'axios';
import './LoginForm.css';
import * as validation from './Validation';

const LOGIN_URL = 'http://localhost:3001/users/login';

class LoginContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameError: false,
      passwordError: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    // Reset errors
    this.setState(
      {
        usernameError: false,
        passwordError: false,
      },
      () => {
        validation.setError('');
        this.sendRequest();
      }
    );
  }

  sendRequest() {
    if (this.isInputValid()) {
      axios
        .post(LOGIN_URL, {
          username: this.state.username,
          password: this.state.password,
        })
        .then(response => {
          // Save email & redirect
          console.log(response);
          this.setState({ responseEmail: response.data.Response }, () => {
            // TODO remove: prints email
            validation.setError(this.state.responseEmail);
            this.redirect();
          });
        })
        .catch(loginError => {
          // Invalid login
          console.log(loginError);
          var error = loginError.response.data.ErrorMessage;
          if (validation.checkError(error)) {
            this.setInvalidCredentials();
          } else {
            validation.setError(error);
          }
        });
    }
  }

  redirect() {
    //TODO
  }

  isInputValid() {
    var id = this.state.username;
    var password = this.state.password;
    var isValid = true;

    // Check if username & password are empty
    if (validation.isEmpty(password)) {
      validation.setError('Password is required.');
      this.updateErrorState('passwordError', true);
      isValid = false;
    }
    if (validation.isEmpty(id)) {
      validation.setError('Student ID is required.');
      this.updateErrorState('usernameError', true);
      isValid = false;
    }

    if (isValid === true) {
      if (validation.isStudentId(id)) {
        this.setInvalidCredentials();
        isValid = false;
      } else if (validation.checkPassword(password)) {
        // Password length out of range
        this.setInvalidCredentials();
        isValid = false;
      }
    }

    return isValid;
  }

  updateErrorState(field, isError) {
    this.setState({
      [field]: [isError],
    });
  }

  setInvalidCredentials() {
    validation.setError('Invalid crendentials. Please try again.');
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Section className="form" flexDirection="column">
        <text className="error" id="error-msg" />
        <EditText
          required
          label="Student ID"
          id="username-input"
          type="username"
          name="username"
          defaultValue={this.state.username}
          onChange={this.handleInputChange}
          error={this.state.usernameError}
        />
        <EditText
          required
          label="Password"
          id="password-input"
          type="password"
          name="password"
          defaultValue={this.state.password}
          onChange={this.handleInputChange}
          error={this.state.passwordError}
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
