import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import DropDown from '../DropDownOutlined/DropDown';

const tempYears = ['2014', '2015', '2016', '2017', '2018', '2019'];
const tempCurriculum = ['7 semesters', '8 semesters'];
const tempMajors = ['Computer', 'Electrical', 'Software'];

class SignupContent extends Component {
  render() {
    return (
      <Section className="form" flexDirection="column">
        <text className="error" id="error-msg" />
        <Section className="subform" flexDirection="row">
          <EditText label="Full Name" /> &nbsp;
          <EditText required label="Student ID" />
        </Section>
        <EditText
          required
          label="Email"
          id="outlined-email-input"
          type="email"
        />
        <Section className="subform" flexDirection="row">
          <EditText
            required
            label="Password"
            id="outlined-password-input"
            type="password"
          />
          &nbsp;
          <EditText
            required
            label="Confirm password"
            id="outlined-password-input"
            type="password"
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
        <button className="primary-button">Sign up</button>
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
