import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import './AdminForm.css';

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCourse: this.props.selectedcourse,
    };
  }

  render() {
    return (
      <Section className="form" flexDirection="column">
        <Section className="subform" flexDirection="row">
          <EditText
            required
            label="Course code"
            id="course-code-input"
            type="text"
            name="course code"
            defaultValue={this.state.selectedCourse.course_code}
            onChange={this.props.handleInputChange}
            // error={this.state.usernameError}
          />
        </Section>
        <EditText
          required
          label="Title"
          id="title-input"
          type="text"
          name="title"
          defaultValue={this.state.selectedCourse.title}
          onChange={this.props.handleInputChange}
          // error={this.state.usernameError}
        />
        <EditText
          required
          label="Description"
          id="desc-input"
          type="text" //TODO make it multiline?
          name="desc"
          defaultValue={this.state.selectedCourse.description}
          onChange={this.props.handleInputChange}
          // error={this.state.emailError}
        />
        <Section className="subform" flexDirection="row">
          <EditText
            required
            label="Number of credits"
            id="credits-input"
            type="number"
            name="credits"
            defaultValue={this.state.selectedCourse.credits}
            onChange={this.props.handleInputChange}
            // error={this.state.passwordError}
          />
        </Section>
      </Section>
    );
  }
}

export default AdminForm;
