import React from 'react';
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

function CustomizedInputs(props) {
  const { classes } = props;
  return (
    <MuiThemeProvider theme={theme}>
      <TextField
        required={props.required}
        className={classes.root}
        id={props.id}
        label={props.label}
        type={props.type}
        name={props.type}
        autoComplete={props.type}
        margin="normal"
        variant="outlined"
      />
    </MuiThemeProvider>
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedInputs);
