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
    minWidth: 150,
    width: 190,
    background: 'white',
    height: '54px',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class NativeSelects extends React.Component {
  state = {
    age: '',
    labelWidth: 0,
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-age-native-simple"
            >
              {this.props.label}
            </InputLabel>
            <Select
              value={this.state.age}
              onChange={this.handleChange('age')}
              input={
                <OutlinedInput
                  name="age"
                  labelWidth={this.state.labelWidth}
                  id="outlined-age-native-simple"
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

NativeSelects.propTypes = {
  classes: PropTypes.object.isRequired,
  menuList: PropTypes.arrayOf(PropTypes.string),
};

export default withStyles(styles)(NativeSelects);
