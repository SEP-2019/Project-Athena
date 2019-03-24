import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
    },
  },
  typography: { useNextVariants: true },
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: '5px 0 5px 0',
    width: 125,

    background: 'white',
    height: '54px',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class DropDown extends React.Component {
  state = {
    labelWidth: 0,
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleChange(event) {
    this.props.onChange(event);
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <FormControl
            required
            variant="outlined"
            className={classes.formControl}
            error={this.props.error}
          >
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="dropdown-input"
            >
              {this.props.label}
            </InputLabel>
            <Select
              value={this.props.defaultValue}
              onChange={e => this.handleChange(e)}
              name={this.props.name}
              input={
                <OutlinedInput
                  labelWidth={this.state.labelWidth}
                  id="dropdown-input"
                />
              }
            >
              {this.props.menuList.map((item, index) => (
                <MenuItem key={index} value={item} className="menu-item">
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </MuiThemeProvider>
    );
  }
}

DropDown.propTypes = {
  // Array of strings to appear in the menu of the drop down
  menuList: PropTypes.arrayOf(PropTypes.string),
  // Passes the value to the parent
  onChange: PropTypes.func,
  // Initial default value of the dropdown
  defaultValue: PropTypes.string,
};

export default withStyles(styles)(DropDown);
