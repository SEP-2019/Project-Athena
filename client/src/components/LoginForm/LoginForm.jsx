import React, { Component } from 'react';
import Section from '../Section';
import SignupContent from './SignupContent';
import LoginContent from './LoginContent';

class LoginForm extends Component {
  state = {
    loginForm: true,
  };

  handleSwitchToLogin = () => {
    this.setState({
      loginForm: true,
    });
  };

  handleSwitchToSignup = () => {
    this.setState({
      loginForm: false,
    });
  };

  render() {
    return (
      <Section>
        {this.state.loginForm ? (
          <LoginContent handleChange={this.handleSwitchToSignup} />
        ) : (
          <SignupContent handleChange={this.handleSwitchToLogin} />
        )}
      </Section>
    );
  }
}

export default LoginForm;
