import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class EditText extends Component {
  render() {
    return (
      <TextField
        id={this.props.id}
        label={this.props.label}
        type={this.props.type}
        name={this.props.type}
        autoComplete={this.props.type}
        margin="normal"
        variant="outlined"
      />
    );
  }
}

export default EditText;
