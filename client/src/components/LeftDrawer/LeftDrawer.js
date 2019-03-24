import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import MenuButton from '../MenuButton/MenuButton';
import './LeftDrawer.css';
import Cookies from 'universal-cookie';

const styles = {
  list: {
    width: 270,
  },
};

class LeftDrawer extends React.Component {
  state = {
    openDrawer: false,
  };

  toggleDrawer = open => () => {
    this.setState({
      openDrawer: open,
    });
  };

  logout = () => {
    console.log('Logging out');
    const cookies = new Cookies();
    cookies.remove('studentId', '/');
    cookies.remove('email', '/');
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <div className="Temporary_Drawer_User">
          <img
            alt="User"
            className="Temporary_Drawer_User_Pic"
            src="https://static.myfigurecollection.net/pics/figure/big/105649.jpg"
            style={{ width: 60, height: 60 }}
          />
          <p className="Temporary_Drawer_User_Name">{this.props.email}</p>
        </div>
        <Divider />
        <List>
          {this.props.pages.map((page, i) => (
            <Link to={page.path} key={i} className="link">
              <ListItem button>
                <ListItemIcon>
                  <img
                    alt="for pages"
                    src="http://mawarupenguindrum.moonfruit.fr/communities/5/000/001/348/125/images/1860781.png"
                    style={{ width: 30, height: 30 }}
                  />
                </ListItemIcon>
                <ListItemText primary={page.label} />
              </ListItem>
            </Link>
          ))}
          <Link to={'/login'} key={4} className="link">
            <ListItem button onClick={this.logout}>
              <ListItemIcon>
                <img
                  alt="for pages"
                  src="http://mawarupenguindrum.moonfruit.fr/communities/5/000/001/348/125/images/1860781.png"
                  style={{ width: 30, height: 30 }}
                />
              </ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItem>
          </Link>
        </List>
      </div>
    );

    return (
      <div>
        <MenuButton onClick={this.toggleDrawer(true)} />
        <Drawer open={this.state.openDrawer} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

LeftDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(LeftDrawer);
