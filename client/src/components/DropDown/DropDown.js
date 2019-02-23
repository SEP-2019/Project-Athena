import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './DropDown.css';

const overrideStyle = {
  color: '#FFFFFF',
  fontSize: '0.8rem',
  padding: '3px 0 3px 15px',
};

class DropDown extends Component {
  handleChange(event) {
    this.props.getValue(event.target.value);
  }

  render() {
    return (
      <Select
        disableUnderline
        style={overrideStyle}
        value={this.props.defaultValue}
        onChange={e => this.handleChange(e)}
        className="select"
      >
        {this.props.menuList.map((item, index) => (
          <MenuItem key={index} value={item} className="menu-item">
            {item}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

DropDown.propTypes = {
  // Array of strings to appear in the menu of the drop down
  menuList: PropTypes.arrayOf(PropTypes.string),
  // Passes the value to the parent
  getValue: PropTypes.func,
  // Initial default value of the dropdown
  defaultValue: PropTypes.string,
};

export default DropDown;
