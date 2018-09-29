import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Switch, Route } from 'react-router-dom';


import HomePage from './containers/HomePage';
import MatchPage from './containers/MatchPage';
import Authentication from './containers/Authentication';
import Snackbar from './containers/Snackbar';

import NavBar from './components/navbar';
import NotFound from './components/NotFound';


const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  },
});

const Routes = (
  <Switch>
    <Route exact component={HomePage} path='/' />
    <Route exact component={Authentication} path='/auth' />
    <Route exact component={MatchPage} path = '/matches/:fifa_id' />
    <Route path='*' component={NotFound} />
  </Switch>
);

const App = ({classes}) => (
  <div>
    <NavBar 
      children={
        <Grid container spacing={24} direction="column">
          <Snackbar />
          {Routes}
        </Grid>
      }
    />
    {/* <div className={classes.root}> */}
      
    {/* </div> */}
  </div>
);

export default withStyles(styles)(App);
