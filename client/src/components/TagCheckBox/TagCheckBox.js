import React, { Component } from 'react';
import './TagCheckBox.css';

class TagCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="checkbox_area">
        <input
          id={this.props.name}
          type="checkbox"
          name={this.props.name}
          checked={this.props.checked}
          onChange={this.props.handleChange}
        />
        <label htmlFor={this.props.name} className="checkbox_label">
          {this.props.name}, {this.props.checked.toString()}
        </label>
        <label htmlFor={this.props.name} className="custom_checkbox" />
      </div>
    );
  }
}

export default TagCheckBox;
