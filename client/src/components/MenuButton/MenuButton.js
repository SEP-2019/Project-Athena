import React from 'react';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import './MenuButton.css';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});
const whiteTheme = createMuiTheme({
  palette: { primary: { main: '#FFFFFF' } },
  typography: {
    useNextVariants: true,
  },
});
function MenuButton(props) {
  return (
    <div>
      <MuiThemeProvider theme={whiteTheme}>
        <IconButton
          onClick={props.onClick}
          color="primary"
          className="MenuButton"
          aria-label="Open Temporary Drawer"
        >
          <Icon fontSize="large">menu</Icon>
        </IconButton>
      </MuiThemeProvider>
    </div>
  );
}

export default withStyles(styles)(MenuButton);
