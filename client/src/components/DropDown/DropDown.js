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

/**
 * The alternate style is used for the dropdowns for selecting courses in the curriculum display page
 */
const alternateStyle = {
  color: '#000000',
  fontSize: '0.8rem',
  padding: '3px 0 3px 15px',
};

class DropDown extends Component {
  handleChange(event) {
    this.props.getValue(event.target.value);
  }

  handleChangeWithIndex(event, metaData){
    /*
    the associatedIndex property is an optional property in the case of having a bunch of dropdowns
    that need to be associated with some array of potential selections and the event handler needs to
    know the index of which dropdown to update
    */
    
    this.props.associatedIndex !== undefined 
      ? this.props.getValueWithIndex(event.target.value, this.props.associatedIndex, metaData) 
      : this.props.getValue(event.target.value);
  }

  render() {
    return (
      <Select
        disableUnderline
        style={this.props.useAlternateStyle ? alternateStyle : overrideStyle}
        value={this.props.defaultValue}
        onChange={(e, metaData) => this.handleChangeWithIndex(e, metaData)}
        className={this.props.useAlternateStyle ? "course-selection-dropdown" : "select"}
      >
        {this.props.menuList.map((item, index) => (
          <MenuItem key={index} value={item} className="menu-item" disabled={this.props.disabledItems === undefined ? false : this.props.disabledItems[index]}>
            {
              // displayMember is the property that will be displayed in the selection menu.
              // In the case of a list of strings, it can be undefined so the element itself can just be displayed
              item.displayMember !== undefined ? item.displayMember : item
            }
          </MenuItem>
        ))}
      </Select>
    );
  }
}

DropDown.propTypes = {
  // Array of strings to appear in the menu of the drop down
  // It could be an array of objects with a displayMember that's a string
  menuList: PropTypes.array,
  // Passes the value to the parent
  getValue: PropTypes.func,

  // Initial default value of the dropdown
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default DropDown;
