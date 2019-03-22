import React, { Component } from 'react';
import './Login.css';
import Section from '../../components/Section';
import LoginForm from '../../components/LoginForm';

class Login extends Component {
  state = {
    text:
      'Project Athena is an ECSE course recommendation system to help ECSE students determine which courses they are eligible to register for based on their current status or search criteria. The goal is to help create a guide on which courses to take according to the current pre/co-requisites the student has and the desired career path they would like to pursue.',
  };

  render() {
    return (
      <Section
        flexDirection="column"
        justifyContent="space-between"
        style={{ height: '100vh' }}
      >
        <Section className="header">
          <Section className="title">Project Athena</Section>
        </Section>
        <Section
          className="content"
          justifyContent="space-around"
          flexDirection="row"
          alignItems="center"
        >
          <Section className="description">{this.state.text}</Section>
          <Section className="form">
            <LoginForm setEmail={this.props.setEmail} />
          </Section>
        </Section>
        <Section className="footer" />
      </Section>
    );
  }
}

export default Login;
