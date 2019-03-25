import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    background: 'white',
    height: '54px',
    margin: '5px 0 5px 0',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
    },
  },
  typography: { useNextVariants: true },
});

class CustomizedInputs extends Component {
  handleChange(event) {
    this.props.onChange(event);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {this.props.type === 'description' ? (
          <TextField
            value={this.props.defaultValue}
            onChange={e => this.handleChange(e)}
            required={this.props.required}
            className={this.props.classes.root}
            id={this.props.id}
            label={this.props.label}
            type={this.props.type}
            name={this.props.name}
            autoComplete={this.props.type}
            error={this.props.error}
            margin="normal"
            variant="outlined"
            multiline
            rowsMax="4"
          />
        ) : (
          <TextField
            value={this.props.defaultValue}
            onChange={e => this.handleChange(e)}
            required={this.props.required}
            className={this.props.classes.root}
            id={this.props.id}
            label={this.props.label}
            type={this.props.type}
            name={this.props.name}
            autoComplete={this.props.type}
            error={this.props.error}
            margin="normal"
            variant="outlined"
          />
        )}
      </MuiThemeProvider>
    );
  }
}

CustomizedInputs.propTypes = {
  // Propagate change to parent
  onChange: PropTypes.func,
  // Initial default value for the EditText
  defaultValue: PropTypes.string,
};

export default withStyles(styles)(CustomizedInputs);
