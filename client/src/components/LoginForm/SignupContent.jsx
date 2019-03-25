import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import DropDown from '../DropDownOutlined/DropDown';
import Api from '../../services/Api';
import Cookies from 'universal-cookie';
import * as validation from './Validation';
import history from '../../history';

const tempCurriculum = ['7 semesters', '8 semesters'];
const tempMajors = ['Computer', 'Electrical', 'Software'];

const SIGNUP_URL = 'users/addStudentUser';
const YEARS_URL = 'curriculums/getCurriculumData';
const HOME_URL = '/courseRegistration';

class SignupContent extends Component {
  //call get years request

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedMajor: '',
      selectedYear: '',
      selectedCurriculum: '',
      errorMessage: '',
      years: [],
      usernameError: false,
      emailError: false,
      passwordError: false,
      confirmError: false,
      majorError: false,
      curriculumError: false,
      yearError: false,
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
        majorError: false,
        curriculumError: false,
        yearError: false,
        errorMessagere: '',
      },
      () => {
        this.fillRequest();
      }
    );
  }

  async getYears() {
    try {
      let r = await Api().get(YEARS_URL);
      let response = r.data.Response;
      this.setState({
        years: response,
      });
    } catch (e) {
      alert(
        'An error occured while loading your page. \nPlease try again later.'
      );
    }
  }

  fillRequest() {
    var id = this.state.username.replace(/\s/g, '');
    var email = this.state.email;
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;
    var isDropDownValid = true;

    if (!this.state.selectedYear) {
      isDropDownValid = false;
      this.setError('Select your year of enrollment.');
      this.updateErrorState('yearError', true);
    }
    if (this.state.selectedCurriculum) {
      var str = this.state.selectedCurriculum.replace(/\s/g, '-');
      var curriculum = str.substring(0, str.length - 1) + '-curriculum';
    } else {
      isDropDownValid = false;
      this.setError('Select the length of your curriculum.');
      this.updateErrorState('curriculumError', true);
    }
    if (this.state.selectedMajor) {
      var program = this.state.selectedMajor + ' Engineering';
    } else {
      isDropDownValid = false;
      this.setError('Select your major.');
      this.updateErrorState('majorError', true);
    }

    if (
      this.isInputValid(id, email, password, confirmPassword) &&
      isDropDownValid
    ) {
      this.sendRequest(id, password, email, program, curriculum);
    }
  }

  sendRequest(id, password, email, program, curriculum) {
    Api()
      .post(SIGNUP_URL, {
        username: id,
        password: password,
        email: email,
        student_id: id,
        program: program,
        year: this.state.selectedYear,
        curr_type: curriculum,
      })
      .then(response => {
        const cookies = new Cookies();
        cookies.set('studentId', id, { path: '/' });
        cookies.set('email', response.data.Response, { path: '/' });
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

  redirect = () => {
    history.push(HOME_URL);
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

    return isValid;
  }

  displaySignupError(error) {
    if (error === 'ER_DUP_ENTRY') {
      this.setError('User with this student ID already exists.');
    } else if (error.includes('Curriculum with name')) {
      this.setError('Sorry, this curriculum is currently unsupported.');
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

  componentDidMount() {
    this.getYears();
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
        <Section className="subform_dropdown" flexDirection="row">
          <DropDown
            label="ECSE major"
            menuList={tempMajors}
            name="selectedMajor"
            defaultValue={this.state.selectedMajor}
            onChange={this.handleInputChange}
            error={this.state.majorError}
          />
          &nbsp;
          <DropDown
            label="Curriculum"
            menuList={tempCurriculum}
            name="selectedCurriculum"
            defaultValue={this.state.selectedCurriculum}
            onChange={this.handleInputChange}
            error={this.state.curriculumError}
          />
          &nbsp;
          <DropDown
            label="Start year"
            menuList={this.state.years}
            name="selectedYear"
            defaultValue={this.state.selectedYear}
            onChange={this.handleInputChange}
            error={this.state.yearError}
          />
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
