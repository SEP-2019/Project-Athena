import React, { Component } from 'react';
import './SmallCheckbox.css';

class SmallCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // handleChange = () => {
  //   const prevCheck = this.state.checked;
  //   this.setState({ checked: !prevCheck });
  // };

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
          {this.props.name}
        </label>
        <label htmlFor={this.props.name} className="custom_checkbox" />
      </div>
    );
  }
}

export default SmallCheckbox;
