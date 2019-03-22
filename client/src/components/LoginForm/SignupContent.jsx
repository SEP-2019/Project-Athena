import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import DropDown from '../DropDownOutlined/DropDown';

const years = ['2014', '2015', '2016', '2017', '2018', '2019'];
const majors = [
  'Computer Engineering',
  'Electrical Engineering',
  'Software Engineering',
];

class SignupContent extends Component {
  render() {
    return (
      <Section className="form" flexDirection="column">
        <Section className="subform" flexDirection="row">
          <EditText label="Full Name" /> &nbsp;
          <EditText label="Student ID" />
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
          <DropDown label="Major" menuList={majors} />
          &nbsp;
          <DropDown label="Year enrolled" menuList={years} />
        </Section>

        {/* Buttons */}
        <button className="primary-button">Sign up</button>
        <Section flexDirection="row" style={{ margin: '1vh' }}>
          <text>Have an account? </text>
          <text
            id="redirect-login"
            onClick={this.props.handleChange}
            style={{
              marginInlineStart: '1vh',
              color: 'blue',
              textDecoration: 'underline',
            }}
          >
            Log in.
          </text>
        </Section>
      </Section>
    );
  }
}

export default SignupContent;
