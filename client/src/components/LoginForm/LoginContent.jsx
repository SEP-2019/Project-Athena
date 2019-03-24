import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import Api from '../../services/Api';
import './LoginForm.css';
import * as validation from './Validation';
import * as login from '../../services/Login';
import history from '../../history';

const LOGIN_URL = 'users/login';

class LoginContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
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
        errorMessagere: '',
      },
      () => {
        this.sendRequest();
      }
    );
  }

  sendRequest() {
    if (
      login.checkAdminUsername(this.state.username) &&
      login.checkAdminPassword(this.state.password)
    ) {
      console.log('Admin detected');
      Api()
        .post(LOGIN_URL, {
          username: login.username,
          password: login.pwd,
        })
        .then(response => {
          if (login.checkResponse(response.data.Response)) {
            this.redirectAdmin();
          } else {
            this.setInvalidCredentials();
          }
        })
        .catch(error => {
          if (validation.isEmpty(error.response)) {
            this.setError(error);
          } else {
            this.setInvalidCredentials();
          }
        });
    } else if (this.isInputValid()) {
      Api()
        .post(LOGIN_URL, {
          username: this.state.username,
          password: this.state.password,
        })
        .then(response => {
          // Save email & redirect
          console.log(response);
          this.props.setEmail(response.data.Response);
          this.redirect();
        })
        .catch(loginError => {
          // Invalid login
          console.log(loginError);
          if (validation.isEmpty(loginError.response)) {
            this.setError(loginError);
          } else {
            this.displayLoginError(loginError.response.data.ErrorMessage);
          }
        });
    }
  }

  displayLoginError(error) {
    if (
      error === 'Password length must be between 8 and 64' ||
      error === 'User does not exist' ||
      error === 'Username length must be less than 64' ||
      error === 'Username must be alphanumeric' ||
      error === 'Incorrect username or password.'
    ) {
      this.setInvalidCredentials();
    } else {
      this.setError(error);
    }
  }

  redirect = () => {
    history.push('/courseregistration');
  };

  redirectAdmin = () => {
    this.setError('ADMIN LOGIN');
    history.push({
      pathname: '/admin',
      isAdmin: true,
    });
  };

  isInputValid() {
    var id = this.state.username.replace(/\s/g, '');
    var password = this.state.password;
    var isValid = true;

    // Check if username & password are empty
    if (validation.isEmpty(password)) {
      this.setError('Password is required.');
      this.updateErrorState('passwordError', true);
      isValid = false;
    }
    if (validation.isEmpty(id)) {
      this.setError('Student ID is required.');
      this.updateErrorState('usernameError', true);
      isValid = false;
    }

    if (isValid === true) {
      if (!validation.isStudentId(id)) {
        this.setInvalidCredentials();
        isValid = false;
      } else if (!validation.isPassword(password)) {
        // Password length out of range
        this.setInvalidCredentials();
        isValid = false;
      }
    }
    return isValid;
  }

  updateErrorState(field, isError) {
    this.setState({
      [field]: isError,
    });
  }

  setError(message) {
    this.setState({
      errorMessage: message,
    });
  }

  setInvalidCredentials() {
    this.setError('Invalid crendentials. Please try again.');
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Section className="form" flexDirection="column">
        <span className="error" id="error-msg">
          {this.state.errorMessage}
        </span>
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
