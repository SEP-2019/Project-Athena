import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import DropDown from '../DropDownOutlined/DropDown';
import axios from 'axios';

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
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    this.setError('Sign up button clicked');
    if (this.isInputValid()) {
      // Send Request
      axios
        .post(SIGNUP_URL, {
          username: this.state.id,
          password: this.state.password,
          email: this.state.email,
          student_id: this.state.username,
        })
        .then(response => {
          // Got good response
          console.log(response);
          // TODO: change page, save email when backend is done
          this.setError('signup successful');
        })
        .catch(loginError => {
          // Invalid login
          console.log(loginError);
          var error = loginError.response.data.ErrorMessage;
          this.setError(error);
        });
    }
  }

  isInputValid() {
    var id = this.state.username.replace(/\s/g, '');
    var email = this.state.email;
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;

    if (this.isStudentId(id)) {
      this.setError('Enter a valid student ID.');
      return false;
    } else if (!this.isEmail(email)) {
      this.setError('Enter a valid email.');
      return false;
    } else if (this.isEmpty(password)) {
      this.setError('Password is required.');
      return false;
    } else if (password.length < 8 || password.length > 64) {
      this.setError('Password must be between 8 and 64 characters.');
      return false;
    } else if (this.isEmpty(confirmPassword) || password !== confirmPassword) {
      this.setError('Passwords do not match.');
      return false;
    }

    // No error
    this.setError('');
    return true;
  }

  setError(message) {
    document.getElementById('error-msg').innerHTML = message;
  }

  isEmail(email) {
    var validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !this.isEmpty(email) && validation.test(String(email).toLowerCase());
  }

  // Student ID should only contain 9 numeric characters
  isStudentId(id) {
    return this.isEmpty(id) || !/^\d+$/.test(id) || id.length !== 9;
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
        <text className="error" id="error-msg" />
        <EditText
          required
          label="Student ID"
          id="id-input"
          type="username"
          defaultValue={this.state.username}
          onChange={this.handleInputChange}
        />
        <EditText
          required
          label="Email"
          id="email-input"
          type="email"
          defaultValue={this.state.email}
          onChange={this.handleInputChange}
        />
        <Section className="subform" flexDirection="row">
          <EditText
            required
            label="Password"
            id="password-input"
            type="password"
            defaultValue={this.state.password}
            onChange={this.handleInputChange}
          />
          &nbsp;
          <EditText
            required
            label="Confirm password"
            id="confirm-password-input"
            type="password"
            defaultValue={this.state.confirmPassword}
            onChange={this.handleInputChange}
          />
        </Section>
        <Section className="subform" flexDirection="row">
          <DropDown label="ECSE major" menuList={tempMajors} />
          &nbsp;
          <DropDown label="Curriculum" menuList={tempCurriculum} />
          &nbsp;
          <DropDown label="Start year" menuList={tempYears} />
        </Section>
        <text className="note">
          Note. Your student ID will be your username.
        </text>

        {/* Buttons */}
        <button className="primary-button" onClick={this.onSignUp}>
          Sign up
        </button>
        <Section
          flexDirection="row"
          justifyContent="flex-end"
          style={{ margin: '1vh' }}
        >
          <text>Have an account? </text>
          <text
            className="link"
            id="redirect-login"
            onClick={this.props.handleChange}
          >
            Log in.
          </text>
        </Section>
      </Section>
    );
  }
}

export default SignupContent;
