import React, { Component } from 'react';
import Section from '../Section';
import EditText from '../EditText';
import './AdminForm.css';
import TagCheckBox from '../TagCheckBox/TagCheckBox';

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   selectedCourse: this.props.selectedCourse,
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
            name="course_code"
            defaultValue={this.props.selectedCourse.course_code}
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
          defaultValue={this.props.selectedCourse.title}
          onChange={this.props.handleInputChange}
          // error={this.state.usernameError}
        />
        <EditText
          required
          label="Description"
          id="desc-input"
          type="text" //TODO make it multiline?
          name="description"
          defaultValue={this.props.selectedCourse.description}
          onChange={this.props.handleInputChange}
          // error={this.state.emailError}
        />
        <Section className="subform" flexDirection="row">
          <EditText
            required
            className="column"
            label="Number of credits"
            id="credits-input"
            type="number"
            name="credits"
            defaultValue={this.props.selectedCourse.credits}
            onChange={this.props.handleInputChange}
            // error={this.state.passwordError}
          />
          <TagCheckBox
            className="column"
            key={this.props.selectedCourse.course_code}
            index={this.props.selectedCourse.course_code}
            // the name property is a duplicate property referring to the label of the checkbox
            // as well as the property that is passed to the event handler. keep it as 
            // "phased_out" or else it won't set the new value properly
            name={"phased_out"}
            checked={this.props.selectedCourse.phased_out}
            handleChange={this.props.handleInputChange}
          />
        </Section>
      </Section>
    );
  }
}

export default AdminForm;
