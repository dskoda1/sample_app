import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
 
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';


import { hideNotification } from '../redux/actions';

const styles = theme => ({
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.secondary.dark,
    },
    success: {
        backgroundColor: green[600],
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  });

class AppSnackbar extends Component {
  state = {
    open: false,
  };

  componentWillReceiveProps(nextProps) {
      if (this.props.notification === null && nextProps.notification !== null) {
        console.log('Setting state to open')
        this.setState({open: true})
      }
      else if(this.props.notification !== null && nextProps.notification === null) {
        console.log('Setting state to closed')
        this.setState({open: false})
      }
  }

  render() {
    const { notification, hideNotification, variant, classes } = this.props;
    const { open } = this.state;
    return notification !== null ? (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={hideNotification}
          open={open}
          variant={variant}
        >
            <SnackbarContent
                className={classes[variant]}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                    {/* <Icon className={classNames(classes.icon, classes.iconVariant)} /> */}
                    {notification}
                    </span>
                }
            />
        </Snackbar>
      </div>
    ) : (<div></div>)
  }
}

const mapStateToProps = ({notification: { notification, variant }}) => {
    return {
        notification,
        variant,
    }
}
const mapDispatchToProps = {
    hideNotification
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AppSnackbar));