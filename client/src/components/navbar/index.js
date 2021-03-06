import * as React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import AppDrawer from './AppDrawer';
import AppToolbar from './AppToolbar';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'fixed',
    marginLeft: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
  },
  flex: {
    flex: 1,
  },
  navLink: {
    textDecoration: 'none',
  },
});

class AppNavigation extends React.Component {
  state = {
    open: false,
  };
  // Toggle drawer offers both the AppToolbar and the AppDrawer
  // to have a say in whether the toolbar is open.
  toggleDrawer = open => () => {
    this.setState({
      open,
    });
  };
  render() {
    const { classes, children, appTitle, user, logout } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <AppToolbar
            appTitle={appTitle}
            toggleDrawer={this.toggleDrawer(true)}
            classes={classes}
            user={user}
            logout={logout}
          />
        </AppBar>
        <AppDrawer
          classes={classes}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
          isOpen={this.state.open}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    );
  }
}

AppNavigation.propTypes = {
  user: PropTypes.string,
  logout: PropTypes.func.isRequired,
  children: PropTypes.node,
  appTitle: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(AppNavigation);
