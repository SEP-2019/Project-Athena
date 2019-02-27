import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';

class SignupContent extends Component {
  render() {
    return (
      <Section className="form" flexDirection="column">
        <EditText label="Email" id="outlined-email-input" type="email" />
        <EditText
          label="Password"
          id="outlined-password-input"
          type="password"
        />
        <EditText
          label="Confirm password"
          id="outlined-password-input"
          type="password"
        />
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
