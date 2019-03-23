import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import DropDown from '../DropDownOutlined/DropDown';
import axios from 'axios';
import * as validation from './Validation';
import { customHistory as history } from '../../';

const tempYears = ['2014', '2015', '2016', '2017', '2018', '2019'];
const tempCurriculum = ['7 semesters', '8 semesters'];
const tempMajors = ['Computer', 'Electrical', 'Software'];

const SIGNUP_URL = 'http://localhost:3001/users/addStudentUser';

class SignupContent extends Component {
  //call get years request

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      usernameError: false,
      emailError: false,
      passwordError: false,
      confirmError: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    // Reset errors
    this.setState(
      {
        usernameError: false,
        emailError: false,
        passwordError: false,
        confirmError: false,
        errorMessagere: '',
      },
      () => {
        this.sendSignUpRequest();
      }
    );
  }

  sendSignUpRequest() {
    var id = this.state.username.replace(/\s/g, '');
    var email = this.state.email;
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;

    if (this.isInputValid(id, email, password, confirmPassword)) {
      console.log(id);
      // Send Request
      axios
        .post(SIGNUP_URL, {
          username: id,
          password: password,
          email: email,
          student_id: id,
        })
        .then(response => {
          // Got response
          console.log(response);
          // TODO: change page, save email when backend is done
          // this.props.setEmail(response.data.Response);
          this.redirect();
        })
        .catch(loginError => {
          console.log(loginError);
          // Network Error
          if (validation.isEmpty(loginError.response)) {
            this.setError(loginError);
          } else {
            // Error from server
            this.displaySignupError(loginError.response.data.ErrorMessage);
          }
        });
    }
  }

  redirect = () => {
    history.push('/courseregistration');
  };

  isInputValid(id, email, password, confirmPassword) {
    var isValid = true;

    if (validation.isEmpty(confirmPassword) || password !== confirmPassword) {
      this.setError('Passwords do not match.');
      this.updateErrorState('confirmError', true);
      isValid = false;
    }
    if (validation.isEmpty(password)) {
      this.setError('Password is required.');
      this.updateErrorState('passwordError', true);
      isValid = false;
    } else if (!validation.isPassword(password)) {
      this.setError('Password must be between 8 and 64 characters.');
      this.updateErrorState('passwordError', true);
      isValid = false;
    }
    if (!validation.isEmail(email)) {
      this.setError('Enter a valid email.');
      this.updateErrorState('emailError', true);
      isValid = false;
    }
    if (!validation.isStudentId(id)) {
      this.setError('Enter a valid student ID.');
      this.updateErrorState('usernameError', true);
      isValid = false;
    }
    //TODO, add curiculum validation

    return isValid;
  }

  displaySignupError(error) {
    if (error === 'ER_DUP_ENTRY') {
      this.setError('User with this student ID already exists.');
    } else {
      this.setError(error);
    }
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
          id="id-input"
          type="username"
          name="username"
          defaultValue={this.state.username}
          onChange={this.handleInputChange}
          error={this.state.usernameError}
        />
        <EditText
          required
          label="Email"
          id="email-input"
          type="email"
          name="email"
          defaultValue={this.state.email}
          onChange={this.handleInputChange}
          error={this.state.emailError}
        />
        <Section className="subform" flexDirection="row">
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
          &nbsp;
          <EditText
            required
            label="Confirm password"
            id="confirm-password-input"
            type="password"
            name="confirmPassword"
            defaultValue={this.state.confirmPassword}
            onChange={this.handleInputChange}
            error={this.state.confirmError}
          />
        </Section>
        <Section className="subform" flexDirection="row">
          <DropDown label="ECSE major *" menuList={tempMajors} />
          &nbsp;
          <DropDown label="Curriculum *" menuList={tempCurriculum} />
          &nbsp;
          <DropDown label="Start year *" menuList={tempYears} />
        </Section>
        <span className="note">
          Note. Your student ID will be your username.
        </span>

        {/* Buttons */}
        <button className="primary-button" onClick={this.onSignUp}>
          Sign up
        </button>
        <Section
          flexDirection="row"
          justifyContent="flex-end"
          style={{ margin: '1vh' }}
        >
          <span>Have an account? </span>
          <span
            className="link"
            id="redirect-login"
            onClick={this.props.handleChange}
          >
            Log in.
          </span>
        </Section>
      </Section>
    );
  }
}

export default SignupContent;
