import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import './LoginForm.css';

class LoginContent extends Component {
  render() {
    return (
      <Section className="form" flexDirection="column">
        <EditText label="Email" id="outlined-email-input" type="email" />
        <EditText
          label="Password"
          id="outlined-password-input"
          type="password"
        />
        <button className="primary-button">Log in</button>
        <button className="secondary-button" onClick={this.props.handleChange}>
          Sign up
        </button>
      </Section>
    );
  }
}

export default LoginContent;
